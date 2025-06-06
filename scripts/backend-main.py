from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import uvicorn

# Database setup
SQLITE_DATABASE_URL = "sqlite:///./todos.db"
engine = create_engine(SQLITE_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database model
class TodoDB(Base):
    __tablename__ = "todos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, default="")
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = ""

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class Todo(BaseModel):
    id: int
    title: str
    description: str
    completed: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# FastAPI app
app = FastAPI(title="Todo API", description="A simple Todo API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API endpoints
@app.get("/")
async def root():
    return {"message": "Todo API is running!"}

@app.get("/todos", response_model=List[Todo])
async def get_todos(db: Session = Depends(get_db)):
    """Get all todos"""
    try:
        todos = db.query(TodoDB).all()
        return todos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch todos: {str(e)}")

@app.get("/todos/{todo_id}", response_model=Todo)
async def get_todo(todo_id: int, db: Session = Depends(get_db)):
    """Get a specific todo by ID"""
    try:
        todo = db.query(TodoDB).filter(TodoDB.id == todo_id).first()
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        return todo
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch todo: {str(e)}")

@app.post("/todos", response_model=Todo)
async def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    """Create a new todo"""
    try:
        if not todo.title.strip():
            raise HTTPException(status_code=400, detail="Todo title cannot be empty")
        
        db_todo = TodoDB(
            title=todo.title.strip(),
            description=todo.description.strip() if todo.description else ""
        )
        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)
        return db_todo
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create todo: {str(e)}")

@app.put("/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: int, todo_update: TodoUpdate, db: Session = Depends(get_db)):
    """Update a todo"""
    try:
        db_todo = db.query(TodoDB).filter(TodoDB.id == todo_id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        update_data = todo_update.dict(exclude_unset=True)
        
        if "title" in update_data and not update_data["title"].strip():
            raise HTTPException(status_code=400, detail="Todo title cannot be empty")
        
        for field, value in update_data.items():
            if field in ["title", "description"] and isinstance(value, str):
                value = value.strip()
            setattr(db_todo, field, value)
        
        db_todo.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_todo)
        return db_todo
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update todo: {str(e)}")

@app.delete("/todos/{todo_id}")
async def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """Delete a todo"""
    try:
        db_todo = db.query(TodoDB).filter(TodoDB.id == todo_id).first()
        if not db_todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        
        db.delete(db_todo)
        db.commit()
        return {"message": "Todo deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete todo: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
