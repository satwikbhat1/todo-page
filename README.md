# Todo App - Fullstack Application

A simple Todo web application built with React + Shadcn UI frontend and Python FastAPI backend, using SQLite for persistent local data storage.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as completed/incomplete
- ✅ Clean and responsive UI with Shadcn UI components
- ✅ RESTful API with proper error handling
- ✅ SQLite database for persistent storage
- ✅ Real-time todo statistics
- ✅ Toast notifications for user feedback

## Tech Stack

### Frontend
- React 18
- Next.js 14 (App Router)
- Shadcn UI components
- Tailwind CSS
- TypeScript

### Backend
- Python 3.8+
- FastAPI
- SQLAlchemy ORM
- SQLite database
- Pydantic for data validation

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Backend Setup

1. **Navigate to the project directory and create a virtual environment:**
   \`\`\`bash
   python -m venv venv
   \`\`\`

2. **Activate the virtual environment:**
   
   On Windows:
   \`\`\`bash
   venv\\Scripts\\activate
   \`\`\`
   
   On macOS/Linux:
   \`\`\`bash
   source venv/bin/activate
   \`\`\`

3. **Install Python dependencies:**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Start the backend server:**
   \`\`\`bash
   python scripts/backend-main.py
   \`\`\`
   
   The API will be available at \`http://localhost:8000\`
   
   You can view the API documentation at \`http://localhost:8000/docs\`

### Frontend Setup

1. **Install Node.js dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   
   The frontend will be available at \`http://localhost:3000\`

## Usage

1. Start the backend server first (it will create the SQLite database automatically)
2. Start the frontend development server
3. Open your browser and navigate to \`http://localhost:3000\`
4. Start creating and managing your todos!

## API Endpoints

- \`GET /\` - API health check
- \`GET /todos\` - Get all todos
- \`GET /todos/{id}\` - Get a specific todo
- \`POST /todos\` - Create a new todo
- \`PUT /todos/{id}\` - Update a todo
- \`DELETE /todos/{id}\` - Delete a todo

## Database

The application uses SQLite with the following schema:

\`\`\`sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY,
    title VARCHAR NOT NULL,
    description VARCHAR DEFAULT '',
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Project Structure

\`\`\`
todo-app/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main todo application component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Shadcn UI components
├── scripts/               # Backend Python scripts
│   └── backend-main.py    # FastAPI application
├── requirements.txt       # Python dependencies
├── package.json          # Node.js dependencies
└── README.md             # This file
\`\`\`

## Development Notes

- The backend includes comprehensive error handling and validation
- CORS is configured to allow requests from the frontend
- The SQLite database file (\`todos.db\`) will be created automatically
- All API responses follow RESTful conventions
- The frontend includes loading states and error handling with toast notifications

## Python Version

This project requires Python 3.8 or higher. It has been tested with Python 3.8, 3.9, 3.10, and 3.11.

## Troubleshooting

1. **Backend not starting:** Make sure you have activated the virtual environment and installed all dependencies
2. **Frontend not connecting to backend:** Ensure the backend is running on port 8000
3. **CORS errors:** The backend is configured to allow requests from localhost:3000
4. **Database issues:** Delete the \`todos.db\` file and restart the backend to recreate the database

## License

This project is created for the Canary Mail Fullstack Developer Assignment.
