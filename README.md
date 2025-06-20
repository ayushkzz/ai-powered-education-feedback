# Education Coding Platform

A modern, visually appealing coding platform for education, featuring a split layout: questions on the left, a code editor and feedback on the right. Built with React (Vite) for the frontend and Flask for the backend.

## Features
- Clean, centered, professional UI
- Question cards and large code editor
- Real-time feedback (no test cases/results shown)
- Responsive and demo-ready

## Project Structure
```
ai-powered-education-feedback/
  ├── backend/           # Flask backend
  │   ├── app.py
  │   ├── questions.json
  │   ├── requirements.txt
  │   ├── all_models/
  │   ├── phi2_feedback_model
  │   ├── topics_dataset.json
  ├── education-platform/ # React frontend
  │   ├── public/         # Static assets
  │   ├── src/            # React source
  │   ├── package.json    # Frontend dependencies
  │   ├── vite.config.js  # Vite config
  │   ├── README.md       # Frontend description
  ├── README.md           # Project description
  └── .gitignore          # Git ignore rules
```

## Getting Started

### Backend (Flask)
1. Navigate to `backend/`
2. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the backend:
   ```sh
   python app.py
   ```

### Frontend (React + Vite)
1. Navigate to the project root (`education-platform/`)
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```

## How to Run the Project

### 1. Start the Backend (Flask)
- Open a terminal and navigate to the `backend/` directory:
  ```sh
  cd backend
  ```
- (Recommended) Create and activate a virtual environment:
  ```sh
  python -m venv venv
  # On Windows:
  venv\Scripts\activate
  # On Mac/Linux:
  source venv/bin/activate
  ```
- Install backend dependencies:
  ```sh
  pip install -r requirements.txt
  ```
- Start the backend server:
  ```sh
  python app.py
  ```
  The backend will run at `http://localhost:5000`

### 2. Start the Frontend (React + Vite)
- Open a new terminal and navigate to the project root (`education-platform/`):
  ```sh
  cd education-platform
  ```
- Install frontend dependencies:
  ```sh
  npm install
  ```
- Start the frontend development server:
  ```sh
  npm run dev
  ```
  The frontend will run at `http://localhost:5173`

### 3. Open in Browser
- Visit `http://localhost:5173` to use the platform.
- Ensure the backend (`http://localhost:5000`) is running for full functionality.

## License
MIT
