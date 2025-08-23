# Web Development (Flask / FastAPI & API Best Practices)

## Flask

### Installation
```bash
pip install flask
```

### Basic Flask App
```python
# Basic Flask application with multiple routes and HTTP methods
from flask import Flask, request, jsonify  # Import Flask core components for web development

app = Flask(__name__)  # Create Flask application instance with current module name

@app.route('/')  # Route decorator: maps URL path to function (root endpoint)
def hello():
    return 'Hello, World!'  # Return simple text response for root URL

@app.route('/api/users', methods=['GET'])  # Route with specific HTTP method (GET only)
def get_users():
    # Mock data: in real app, this would come from database
    users = [
        {'id': 1, 'name': 'Alice'},  # User object with id and name fields
        {'id': 2, 'name': 'Bob'}     # Second user object in the list
    ]
    return jsonify(users)  # Convert Python dict to JSON response with proper headers

@app.route('/api/users/<int:user_id>', methods=['GET'])  # Route with URL parameter (converted to integer)
def get_user(user_id):
    # Simulate database lookup using the user_id parameter from URL
    user = {'id': user_id, 'name': f'User {user_id}'}  # Create user object dynamically based on ID
    return jsonify(user)  # Return JSON response with user data

if __name__ == '__main__':  # Standard Python idiom for script execution (only run if file is executed directly)
    app.run(debug=True)     # Start Flask development server with debug mode enabled
```

### Request Handling
```python
# Flask request handling: processing different HTTP methods and request data
from flask import Flask, request, jsonify  # Import Flask components for request handling

app = Flask(__name__)  # Create Flask application instance

@app.route('/api/users', methods=['POST'])  # Route for creating new users (POST method)
def create_user():
    data = request.get_json()  # Parse JSON data from request body into Python dict
    
    # Input validation: check if required data is present in request
    if not data or 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400  # Return error response with 400 Bad Request status
    
    # Process user creation: build user object from validated request data
    user = {
        'id': 123,                    # Mock user ID (in real app, generate unique ID from database)
        'name': data['name'],         # Required field from request (validated above)
        'email': data.get('email', '') # Optional field with default empty string if not provided
    }
    
    return jsonify(user), 201  # Return created user with 201 Created status code

@app.route('/api/users/<int:user_id>', methods=['PUT'])  # Route for updating existing users (PUT method)
def update_user(user_id):
    data = request.get_json()  # Parse JSON data from request body into Python dict
    
    # Update user logic: create updated user object with provided data
    user = {
        'id': user_id,                # Use provided user ID from URL parameter
        'name': data.get('name', ''), # Update name if provided, otherwise keep empty string
        'email': data.get('email', '') # Update email if provided, otherwise keep empty string
    }
    
    return jsonify(user)  # Return updated user object as JSON response

@app.route('/api/users/<int:user_id>', methods=['DELETE'])  # Route for deleting users (DELETE method)
def delete_user(user_id):
    # Delete user logic: in real app, remove user from database using user_id
    return '', 204  # Return empty response with 204 No Content status (successful deletion)
```

### Templates and Static Files
```python
from flask import Flask, render_template, url_for  # Import Flask components for template rendering

app = Flask(__name__)  # Create Flask application instance

@app.route('/')  # Route for homepage
def index():
    users = [
        {'name': 'Alice', 'email': 'alice@example.com'},  # User data for template rendering
        {'name': 'Bob', 'email': 'bob@example.com'}       # Second user data
    ]
    return render_template('index.html', users=users)  # Render HTML template with user data

@app.route('/user/<name>')  # Route with dynamic parameter for user profiles
def user_profile(name):
    return render_template('user.html', name=name)  # Render user profile template with name parameter
```

### Flask Configuration
```python
from flask import Flask  # Import Flask for web application framework
import os  # Import os for environment variable access

app = Flask(__name__)  # Create Flask application instance

# Configuration: set application settings from environment variables
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key')  # Secret key for sessions (use env var or default)
app.config['DATABASE_URL'] = os.environ.get('DATABASE_URL')  # Database connection string from environment
app.config['DEBUG'] = os.environ.get('FLASK_ENV') == 'development'  # Enable debug mode in development

# Alternative configuration class: organized configuration management
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard-to-guess-string'  # Secret key with fallback
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')  # Database URI for SQLAlchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable SQLAlchemy modification tracking for performance

class DevelopmentConfig(Config):
    DEBUG = True  # Enable debug mode for development environment

class ProductionConfig(Config):
    DEBUG = False  # Disable debug mode for production security

# Using configuration: apply configuration class to Flask app
app.config.from_object(DevelopmentConfig)  # Load development configuration settings
```

## FastAPI

### Installation
```bash
pip install fastapi uvicorn
```

### Basic FastAPI App
```python
from fastapi import FastAPI, HTTPException  # Import FastAPI framework and exception handling
from pydantic import BaseModel  # Import Pydantic for data validation and serialization
from typing import List, Optional  # Import type hints for better code documentation

app = FastAPI(title="My API", version="1.0.0")  # Create FastAPI application with metadata

# Pydantic models: define data structures with automatic validation
class User(BaseModel):
    id: Optional[int] = None  # Optional user ID (None for new users)
    name: str  # Required user name (string)
    email: str  # Required user email (string)
    age: Optional[int] = None  # Optional user age (integer or None)

class UserCreate(BaseModel):
    name: str  # Required user name for creation
    email: str  # Required user email for creation
    age: Optional[int] = None  # Optional user age for creation

# Sample data: in-memory storage for demonstration (use database in production)
users = [
    User(id=1, name="Alice", email="alice@example.com", age=30),  # First user
    User(id=2, name="Bob", email="bob@example.com", age=25)       # Second user
]

@app.get("/")  # Root endpoint (GET method)
def read_root():
    return {"message": "Hello World"}  # Return simple JSON response

@app.get("/users", response_model=List[User])  # Get all users endpoint
def get_users():
    return users  # Return list of all users (automatically serialized to JSON)

@app.get("/users/{user_id}", response_model=User)  # Get specific user endpoint with path parameter
def get_user(user_id: int):  # Path parameter automatically converted to integer
    for user in users:  # Search through users list
        if user.id == user_id:  # Check if user ID matches
            return user  # Return found user (automatically serialized)
    raise HTTPException(status_code=404, detail="User not found")  # Raise 404 if user not found

@app.post("/users", response_model=User, status_code=201)  # Create user endpoint (POST method)
def create_user(user: UserCreate):  # Request body automatically validated against UserCreate model
    new_user = User(  # Create new User instance
        id=len(users) + 1,  # Generate new ID (simple increment)
        name=user.name,     # Copy name from request
        email=user.email,   # Copy email from request
        age=user.age        # Copy age from request (can be None)
    )
    users.append(new_user)  # Add new user to storage
    return new_user  # Return created user (automatically serialized with 201 status)
```

### FastAPI with Dependencies
```python
from fastapi import FastAPI, Depends, HTTPException, status  # Import FastAPI components for dependency injection
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials  # Import security components for authentication
from typing import Optional  # Import type hints

app = FastAPI()  # Create FastAPI application instance
security = HTTPBearer()  # Create HTTP Bearer token security scheme

# Dependency for authentication: validate JWT tokens and extract user information
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):  # Dependency injection for auth
    token = credentials.credentials  # Extract token from Authorization header
    # Validate token logic here  # Placeholder for JWT validation logic
    if token != "valid-token":  # Simple token validation (use proper JWT validation in production)
        raise HTTPException(  # Raise HTTP exception for invalid authentication
            status_code=status.HTTP_401_UNAUTHORIZED,  # 401 Unauthorized status code
            detail="Invalid authentication credentials"  # Error message for client
        )
    return {"user_id": 123, "username": "alice"}  # Return user information if token is valid

@app.get("/protected")  # Protected endpoint requiring authentication
def protected_route(current_user = Depends(get_current_user)):  # Inject current user from dependency
    return {"message": "This is protected", "user": current_user}  # Return protected data with user info

# Database dependency: manage database connections with proper cleanup
def get_db():  # Database connection dependency
    # Database connection logic  # Placeholder for database connection setup
    db = "database_connection"  # Mock database connection object
    try:
        yield db  # Provide database connection to endpoint
    finally:
        # Close database connection  # Cleanup code that always runs
        pass  # Placeholder for connection cleanup

@app.get("/users")  # Endpoint that uses database dependency
def get_users(db = Depends(get_db)):  # Inject database connection from dependency
    # Use database connection  # Placeholder for database query logic
    return {"users": []}  # Return empty users list (replace with actual database query)
```

### FastAPI with SQLAlchemy
```python
from fastapi import FastAPI, Depends, HTTPException  # Import FastAPI components for web framework
from sqlalchemy import create_engine, Column, Integer, String  # Import SQLAlchemy for database ORM
from sqlalchemy.ext.declarative import declarative_base  # Import declarative base for model definitions
from sqlalchemy.orm import sessionmaker, Session  # Import session management for database operations
from pydantic import BaseModel  # Import Pydantic for data validation

# Database setup: configure SQLAlchemy connection and session management
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  # SQLite database URL (use PostgreSQL/MySQL in production)
engine = create_engine(SQLALCHEMY_DATABASE_URL)  # Create database engine for connection management
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)  # Create session factory
Base = declarative_base()  # Create declarative base class for model definitions

# SQLAlchemy model: define database table structure
class User(Base):
    __tablename__ = "users"  # Database table name
    id = Column(Integer, primary_key=True, index=True)  # Primary key with index for fast lookups
    name = Column(String, index=True)  # User name with index for search optimization
    email = Column(String, unique=True, index=True)  # Unique email with index for fast lookups

Base.metadata.create_all(bind=engine)  # Create database tables based on model definitions

# Pydantic model: define API request/response schemas with validation
class UserCreate(BaseModel):
    name: str  # Required user name for creation
    email: str  # Required user email for creation

class UserResponse(BaseModel):
    id: int  # User ID from database
    name: str  # User name from database
    email: str  # User email from database

    class Config:
        orm_mode = True  # Enable ORM mode for automatic SQLAlchemy model conversion

app = FastAPI()  # Create FastAPI application instance

# Dependency: manage database sessions with proper cleanup
def get_db():  # Database session dependency
    db = SessionLocal()  # Create new database session
    try:
        yield db  # Provide session to endpoint
    finally:
        db.close()  # Always close session to prevent connection leaks

@app.post("/users", response_model=UserResponse)  # Create user endpoint with response model
def create_user(user: UserCreate, db: Session = Depends(get_db)):  # Inject database session
    db_user = User(name=user.name, email=user.email)  # Create SQLAlchemy model instance
    db.add(db_user)  # Add user to database session
    db.commit()  # Commit transaction to database
    db.refresh(db_user)  # Refresh object to get auto-generated ID
    return db_user  # Return user object (automatically converted to response model)
```

## API Best Practices

### Error Handling
```python
from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException

app = Flask(__name__)

# Global error handler
@app.errorhandler(HTTPException)
def handle_exception(e):
    response = {
        "error": {
            "code": e.code,
            "name": e.name,
            "description": e.description,
        }
    }
    return jsonify(response), e.code

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500
```

### Request Validation
```python
from flask import Flask, request, jsonify
from marshmallow import Schema, fields, ValidationError

app = Flask(__name__)

class UserSchema(Schema):
    name = fields.Str(required=True, validate=lambda x: len(x) > 0)
    email = fields.Email(required=True)
    age = fields.Int(validate=lambda x: 0 <= x <= 150)

user_schema = UserSchema()

@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = user_schema.load(request.get_json())
        # Process valid data
        return jsonify(data), 201
    except ValidationError as e:
        return jsonify({'errors': e.messages}), 400
```

### Rate Limiting
```python
from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/users')
@limiter.limit("10 per minute")
def get_users():
    return jsonify({'users': []})

@app.route('/api/users/<int:user_id>')
@limiter.limit("5 per minute")
def get_user(user_id):
    return jsonify({'user_id': user_id})
```

### CORS Handling
```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Or configure specific origins
CORS(app, origins=["http://localhost:3000", "https://myapp.com"])
```

### Logging
```python
import logging
from flask import Flask, request
import time

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.before_request
def log_request_info():
    logger.info('Headers: %s', dict(request.headers))
    logger.info('Body: %s', request.get_data())

@app.after_request
def log_response_info(response):
    logger.info('Response: %s', response.get_data())
    return response

@app.route('/api/users')
def get_users():
    logger.info('Fetching users')
    return {'users': []}
```

### API Documentation
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="User Management API",
    description="A simple API for managing users",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

class User(BaseModel):
    id: int
    name: str
    email: str
    
    class Config:
        schema_extra = {
            "example": {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com"
            }
        }

@app.get("/users/{user_id}", 
         response_model=User,
         summary="Get a user by ID",
         description="Retrieve a user by their unique identifier")
def get_user(user_id: int):
    """
    Get a user by ID.
    
    - **user_id**: The unique identifier of the user
    
    Returns the user information if found.
    """
    return {"id": user_id, "name": "John Doe", "email": "john@example.com"}
```

### Testing APIs
```python
import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_create_user():
    user_data = {"name": "Alice", "email": "alice@example.com"}
    response = client.post("/users", json=user_data)
    assert response.status_code == 201
    assert response.json()["name"] == "Alice"

def test_get_user_not_found():
    response = client.get("/users/999")
    assert response.status_code == 404
```

### Environment Configuration
```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')
```

### Production Deployment
```python
# gunicorn configuration
# gunicorn.conf.py
bind = "0.0.0.0:8000"
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
timeout = 120
keepalive = 2

# Docker example
# Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "app:app", "-c", "gunicorn.conf.py"]
```

---

[Previous Chapter](06-files.md) | [Next Chapter](08-testing.md)
