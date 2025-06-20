from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch
import sys
import io
import traceback
import json
from flask_cors import CORS
from sentence_transformers import SentenceTransformer, util
from transformers import AutoTokenizer as Seq2SeqTokenizer, AutoModelForSeq2SeqLM
from difflib import SequenceMatcher

app = Flask(__name__)
CORS(app)

class AIEduFeedbackSystem:
    def __init__(self, json_path="topics_dataset.json"):
        print("🚀 Initializing AI Feedback System...")
        # Load models directly from Hugging Face Hub
        self.similarity_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        self.qg_tokenizer = Seq2SeqTokenizer.from_pretrained("t5-small")
        self.qg_model = AutoModelForSeq2SeqLM.from_pretrained("t5-small")

        self.topics = self.load_topics(json_path)

    def load_topics(self, file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def get_text_feedback(self, reference, student_input):
        ref_embed = self.similarity_model.encode(reference, convert_to_tensor=True)
        student_embed = self.similarity_model.encode(student_input, convert_to_tensor=True)
        similarity_score = util.cos_sim(ref_embed, student_embed).item()
        if similarity_score > 0.7:
            match = "✅ Concept match: Excellent"
        elif similarity_score > 0.4:
            match = "🔶 Partial concept match"
        else:
            match = "❌ Weak or incorrect concept"
        return {
            "match": match,
            "similarity_score": round(similarity_score, 2)
        }

    def detect_misconception(self, student, reference):
        similarity = SequenceMatcher(None, student.lower(), reference.lower()).ratio()
        return "✅ Mostly correct." if similarity > 0.7 else "⚠️ Conceptual gap detected. Please review the topic."

    def generate_practice_question(self, reference):
        prompt = f"generate question: {reference}"
        input_ids = self.qg_tokenizer.encode(prompt, return_tensors='pt')
        output = self.qg_model.generate(input_ids, max_length=64, do_sample=True, top_k=50, top_p=0.92)
        return self.qg_tokenizer.decode(output[0], skip_special_tokens=True)

    def list_topics(self):
        return list(self.topics.keys())

    def get_questions(self, topic):
        return [item["question"] for item in self.topics.get(topic, [])]

    def get_feedback(self, topic, question_index, student_answer):
        try:
            item = self.topics[topic][question_index]
            question = item["question"]
            reference = item["reference"]
            feedback = self.get_text_feedback(reference, student_answer)
            misconception = self.detect_misconception(student_answer, reference)
            practice = self.generate_practice_question(reference)
            return {
                "question": question,
                "student_answer": student_answer,
                "reference_answer": reference,
                "feedback": feedback,
                "misconception": misconception,
                "practice_question": practice
            }
        except Exception as e:
            return {"error": str(e)}

# Initialize the AI Education Feedback System
edu_model = AIEduFeedbackSystem()

@app.route('/edu/topics', methods=['GET'])
def get_edu_topics():
    return jsonify({"topics": edu_model.list_topics()})

@app.route('/edu/questions/<topic>', methods=['GET'])
def get_edu_questions(topic):
    return jsonify({"questions": edu_model.get_questions(topic)})

@app.route('/edu/feedback', methods=['POST'])
def edu_feedback():
    data = request.json
    topic = data.get("topic")
    index = data.get("question_index")
    answer = data.get("student_answer")
    if not topic or index is None or answer is None:
        return jsonify({"error": "Missing required fields"}), 400
    result = edu_model.get_feedback(topic, index, answer)
    return jsonify(result)

# Load feedback model and tokenizer directly from Hugging Face Hub
feedback_model_id = "microsoft/phi-2"
tokenizer = AutoTokenizer.from_pretrained(feedback_model_id)
model = AutoModelForCausalLM.from_pretrained(feedback_model_id)
device = 0 if torch.cuda.is_available() else -1
generator = pipeline("text-generation", model=model, tokenizer=tokenizer, device=device)

# Load questions from JSON file
with open("questions.json", "r") as f:
    QUESTIONS = json.load(f)

def get_question_by_id(qid):
    for q in QUESTIONS:
        if q['id'] == qid:
            return q
    return None

def generate_human_feedback(problem, code, test_results):
    prompt = (
        "You are a supportive Python tutor. First, give SPECIFIC praise about what the student did well. "
        "Then provide ONE actionable improvement suggestion with BRIEF explanation why it matters. "
        "No conversations only precise feedback.\n"
        "Keep it concise (1-2 sentences max).\n"
        f"Problem: {problem}\n"
        f"Code:\n{code}\n"
        f"Test Results: {test_results}\n"
        "Feedback:"
    )
    result = generator(prompt, max_new_tokens=150, do_sample=True, temperature=0.7)
    feedback = result[0]['generated_text'].split("Feedback:")[-1].strip()
    return feedback

@app.route('/questions', methods=['GET'])
def questions():
    return jsonify([
        {k: q[k] for k in q if k != "test_cases"} | {"test_cases": q["test_cases"][:2]}
        for q in QUESTIONS
    ])

@app.route('/question/<question_id>', methods=['GET'])
def get_question(question_id):
    q = get_question_by_id(question_id)
    if q:
        return jsonify(q)
    return jsonify({'error': 'Question not found'}), 404

@app.route('/submit', methods=['POST'])
def submit_code():
    data = request.json
    code = data.get('code')
    question_id = data.get('question_id')
    q = get_question_by_id(question_id)
    if not q:
        return jsonify({'error': 'Question not found'}), 404

    # No code execution, just feedback
    feedback_text = generate_human_feedback(
        q['title'],
        code,
        "No test results: code execution is disabled."
    )

    return jsonify({
        'test_results': [],
        'syntax_error': None,
        'feedback': feedback_text
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
