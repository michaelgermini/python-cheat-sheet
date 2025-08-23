# Security & Safe Coding Practices (Secrets, Validation, Safe File Handling)

## Environment Variables and Secrets Management

### Secure Environment Configuration
```python
import os  # Import operating system interface for environment variables
from typing import Optional  # Import type hints for optional values
from dataclasses import dataclass  # Import dataclass decorator for configuration class
from dotenv import load_dotenv  # Import dotenv for loading environment variables from file

# Load environment variables from .env file (if it exists)
load_dotenv()  # Automatically loads variables from .env file into os.environ

@dataclass
class SecurityConfig:
    """Security configuration with environment variables for secure application setup."""
    
    # Database credentials: sensitive connection information
    DATABASE_URL: str = os.getenv('DATABASE_URL', '')  # Database connection string
    DB_PASSWORD: str = os.getenv('DB_PASSWORD', '')    # Database password
    
    # API keys and secrets: cryptographic keys for application security
    SECRET_KEY: str = os.getenv('SECRET_KEY', '')      # Application secret key for sessions
    API_KEY: str = os.getenv('API_KEY', '')            # External API authentication key
    JWT_SECRET: str = os.getenv('JWT_SECRET', '')      # JSON Web Token signing secret
    
    # External service credentials: third-party service authentication
    AWS_ACCESS_KEY: str = os.getenv('AWS_ACCESS_KEY_ID', '')           # AWS access key
    AWS_SECRET_KEY: str = os.getenv('AWS_SECRET_ACCESS_KEY', '')       # AWS secret key
    REDIS_PASSWORD: str = os.getenv('REDIS_PASSWORD', '')              # Redis authentication password
    
    # Security settings: application security configuration
    DEBUG: bool = os.getenv('DEBUG', 'False').lower() == 'true'        # Debug mode flag
    ALLOWED_HOSTS: list = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')  # Allowed hostnames
    
    def validate(self) -> bool:
        """Validate that all required secrets are set for secure application startup."""
        required_fields = ['SECRET_KEY', 'DATABASE_URL']  # Critical fields that must be present
        
        for field in required_fields:  # Check each required field
            if not getattr(self, field):  # Check if field is empty or None
                raise ValueError(f"Missing required environment variable: {field}")  # Raise error for missing field
        
        return True  # Return True if all validations pass

# Usage: initialize and validate security configuration
try:
    config = SecurityConfig()  # Create configuration instance with environment variables
    config.validate()          # Validate that all required secrets are present
except ValueError as e:        # Handle validation errors
    print(f"Configuration error: {e}")  # Print error message
    exit(1)                    # Exit application with error code
```

### Secrets Management with python-dotenv
```python
# .env file (never commit this to version control) - contains actual secrets
"""
# Database configuration with sensitive credentials
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
DB_PASSWORD=super_secret_password

# API Keys and cryptographic secrets
SECRET_KEY=your-super-secret-key-here
API_KEY=your-api-key-here
JWT_SECRET=your-jwt-secret-here

# External Services credentials
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
REDIS_PASSWORD=redis_secret_password

# Application Settings
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,myapp.com
"""

# .env.example (safe to commit) - template for other developers
"""
# Database configuration template
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
DB_PASSWORD=your_db_password

# API Keys template
SECRET_KEY=your-secret-key-here
API_KEY=your-api-key-here
JWT_SECRET=your-jwt-secret-here

# External Services credentials template
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
REDIS_PASSWORD=your-redis-password

# Application Settings
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
"""

# .gitignore (add these lines to prevent committing secrets)
```
"""
# Environment variables
.env
.env.local
.env.production
.env.staging

# Secrets
*.pem
*.key
*.crt
secrets/
"""

# Environment loader with validation
import os
from typing import Dict, Any

class EnvironmentLoader:
    """Secure environment variable loader."""
    
    def __init__(self, env_file: str = '.env'):
        self.env_file = env_file
        self.load_dotenv()
    
    def load_dotenv(self):
        """Load environment variables from .env file."""
        if os.path.exists(self.env_file):
            load_dotenv(self.env_file)
    
    def get_secret(self, key: str, default: str = None) -> str:
        """Get a secret value with validation."""
        value = os.getenv(key, default)
        
        if not value:
            raise ValueError(f"Missing required environment variable: {key}")
        
        return value
    
    def get_optional(self, key: str, default: str = None) -> str:
        """Get an optional environment variable."""
        return os.getenv(key, default)
    
    def validate_required(self, required_keys: list) -> bool:
        """Validate that all required environment variables are set."""
        missing = []
        
        for key in required_keys:
            if not os.getenv(key):
                missing.append(key)
        
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
        
        return True

# Usage
env = EnvironmentLoader()
required_keys = ['SECRET_KEY', 'DATABASE_URL', 'API_KEY']

try:
    env.validate_required(required_keys)
    secret_key = env.get_secret('SECRET_KEY')
    debug_mode = env.get_optional('DEBUG', 'False')
except ValueError as e:
    print(f"Environment configuration error: {e}")
    exit(1)
```

## Input Validation and Sanitization

### Comprehensive Input Validation
```python
import re
import html
from typing import Any, Dict, List, Optional
from dataclasses import dataclass
from email_validator import validate_email, EmailNotValidError

@dataclass
class ValidationError(Exception):
    """Custom validation error with field context for better error handling."""
    field: str  # Field name that failed validation
    message: str  # Error message describing the validation failure

class InputValidator:
    """Comprehensive input validation class for secure data processing."""
    
    def __init__(self):
        # Common regex patterns for input validation
        self.patterns = {
            'username': r'^[a-zA-Z0-9_]{3,20}$',  # Username: 3-20 alphanumeric characters and underscores
            'password': r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$',  # Strong password with special chars
            'phone': r'^\+?1?\d{9,15}$',  # International phone number format
            'url': r'^https?://(?:[-\w.])+(?:[:\d]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?$',  # URL validation
            'ip_address': r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'  # IPv4 validation
        }
```
    
    def validate_email(self, email: str) -> str:
        """Validate and normalize email address."""
        try:
            validated = validate_email(email)
            return validated.email
        except EmailNotValidError as e:
            raise ValidationError('email', str(e))
    
    def validate_username(self, username: str) -> str:
        """Validate username format."""
        if not re.match(self.patterns['username'], username):
            raise ValidationError('username', 'Username must be 3-20 characters, alphanumeric and underscore only')
        return username.lower()
    
    def validate_password(self, password: str) -> str:
        """Validate password strength."""
        if not re.match(self.patterns['password'], password):
            raise ValidationError('password', 
                'Password must be at least 8 characters with uppercase, lowercase, number, and special character')
        return password
    
    def validate_phone(self, phone: str) -> str:
        """Validate phone number format."""
        if not re.match(self.patterns['phone'], phone):
            raise ValidationError('phone', 'Invalid phone number format')
        return phone
    
    def validate_url(self, url: str) -> str:
        """Validate URL format."""
        if not re.match(self.patterns['url'], url):
            raise ValidationError('url', 'Invalid URL format')
        return url
    
    def sanitize_html(self, text: str) -> str:
        """Sanitize HTML content."""
        return html.escape(text)
    
    def validate_integer(self, value: Any, min_val: int = None, max_val: int = None) -> int:
        """Validate integer with range."""
        try:
            int_val = int(value)
        except (ValueError, TypeError):
            raise ValidationError('integer', 'Value must be a valid integer')
        
        if min_val is not None and int_val < min_val:
            raise ValidationError('integer', f'Value must be at least {min_val}')
        
        if max_val is not None and int_val > max_val:
            raise ValidationError('integer', f'Value must be at most {max_val}')
        
        return int_val
    
    def validate_string(self, value: Any, min_length: int = None, max_length: int = None) -> str:
        """Validate string with length constraints."""
        if not isinstance(value, str):
            raise ValidationError('string', 'Value must be a string')
        
        if min_length is not None and len(value) < min_length:
            raise ValidationError('string', f'String must be at least {min_length} characters')
        
        if max_length is not None and len(value) > max_length:
            raise ValidationError('string', f'String must be at most {max_length} characters')
        
        return value.strip()

# Usage
validator = InputValidator()

try:
    # Validate user input
    email = validator.validate_email("user@example.com")
    username = validator.validate_username("john_doe123")
    password = validator.validate_password("SecurePass123!")
    phone = validator.validate_phone("+1234567890")
    
    # Sanitize user input
    user_input = "<script>alert('xss')</script>"
    sanitized = validator.sanitize_html(user_input)
    
    print(f"Validated email: {email}")
    print(f"Validated username: {username}")
    print(f"Sanitized input: {sanitized}")
    
except ValidationError as e:
    print(f"Validation error in {e.field}: {e.message}")
```

### SQL Injection Prevention
```python
import sqlite3
import psycopg2
from typing import Any, Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)

class SecureDatabase:
    """Database class with SQL injection prevention."""
    
    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self.connection = None
    
    def connect(self):
        """Establish database connection."""
        try:
            if 'postgresql' in self.connection_string:
                self.connection = psycopg2.connect(self.connection_string)
            else:
                self.connection = sqlite3.connect(self.connection_string)
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    def execute_query(self, query: str, params: Tuple = None) -> List[Dict]:
        """Execute a query with parameterized statements."""
        if not self.connection:
            self.connect()
        
        try:
            cursor = self.connection.cursor()
            
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            
            # Fetch results
            if query.strip().upper().startswith('SELECT'):
                columns = [desc[0] for desc in cursor.description]
                results = [dict(zip(columns, row)) for row in cursor.fetchall()]
            else:
                self.connection.commit()
                results = []
            
            cursor.close()
            return results
            
        except Exception as e:
            logger.error(f"Query execution failed: {e}")
            self.connection.rollback()
            raise
    
    def get_user_by_id(self, user_id: int) -> Dict:
        """Get user by ID (safe from SQL injection)."""
        query = "SELECT id, username, email FROM users WHERE id = %s"
        results = self.execute_query(query, (user_id,))
        return results[0] if results else None
    
    def get_users_by_username(self, username: str) -> List[Dict]:
        """Get users by username (safe from SQL injection)."""
        query = "SELECT id, username, email FROM users WHERE username LIKE %s"
        return self.execute_query(query, (f"%{username}%",))
    
    def create_user(self, username: str, email: str, password_hash: str) -> int:
        """Create a new user (safe from SQL injection)."""
        query = """
            INSERT INTO users (username, email, password_hash, created_at)
            VALUES (%s, %s, %s, NOW())
            RETURNING id
        """
        results = self.execute_query(query, (username, email, password_hash))
        return results[0]['id'] if results else None
    
    def update_user(self, user_id: int, **kwargs) -> bool:
        """Update user data (safe from SQL injection)."""
        if not kwargs:
            return False
        
        # Build dynamic query safely
        set_clauses = []
        params = []
        
        for key, value in kwargs.items():
            if key in ['username', 'email', 'password_hash']:
                set_clauses.append(f"{key} = %s")
                params.append(value)
        
        if not set_clauses:
            return False
        
        query = f"UPDATE users SET {', '.join(set_clauses)} WHERE id = %s"
        params.append(user_id)
        
        self.execute_query(query, tuple(params))
        return True
    
    def delete_user(self, user_id: int) -> bool:
        """Delete user (safe from SQL injection)."""
        query = "DELETE FROM users WHERE id = %s"
        self.execute_query(query, (user_id,))
        return True

# Usage
db = SecureDatabase("postgresql://user:pass@localhost/mydb")

# Safe operations
user = db.get_user_by_id(123)
users = db.get_users_by_username("john")
new_user_id = db.create_user("jane_doe", "jane@example.com", "hashed_password")
db.update_user(123, email="newemail@example.com")
db.delete_user(123)
```

## Secure File Handling

### Safe File Operations
```python
import os
import hashlib
import mimetypes
from pathlib import Path
from typing import Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class SecureFileHandler:
    """Secure file handling with validation and safety checks."""
    
    def __init__(self, upload_dir: str = "uploads", max_file_size: int = 10 * 1024 * 1024):
        self.upload_dir = Path(upload_dir)
        self.max_file_size = max_file_size
        
        # Allowed file extensions and MIME types
        self.allowed_extensions = {
            '.txt', '.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif',
            '.csv', '.xlsx', '.xls'
        }
        
        self.allowed_mime_types = {
            'text/plain', 'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg', 'image/png', 'image/gif', 'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
        
        # Create upload directory if it doesn't exist
        self.upload_dir.mkdir(parents=True, exist_ok=True)
    
    def validate_file(self, file_path: str, file_size: int) -> Tuple[bool, str]:
        """Validate file for security."""
        # Check file size
        if file_size > self.max_file_size:
            return False, f"File size exceeds maximum allowed size of {self.max_file_size} bytes"
        
        # Check file extension
        file_ext = Path(file_path).suffix.lower()
        if file_ext not in self.allowed_extensions:
            return False, f"File extension '{file_ext}' is not allowed"
        
        # Check MIME type
        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type not in self.allowed_mime_types:
            return False, f"MIME type '{mime_type}' is not allowed"
        
        return True, "File is valid"
    
    def generate_safe_filename(self, original_filename: str) -> str:
        """Generate a safe filename to prevent path traversal attacks."""
        # Remove any path components
        filename = Path(original_filename).name
        
        # Generate hash for uniqueness
        hash_suffix = hashlib.md5(filename.encode()).hexdigest()[:8]
        
        # Get file extension
        ext = Path(filename).suffix.lower()
        
        # Create safe filename
        safe_name = f"{hash_suffix}_{filename}"
        
        return safe_name
    
    def save_file_safely(self, file_content: bytes, original_filename: str) -> Optional[str]:
        """Save file with security checks."""
        try:
            # Generate safe filename
            safe_filename = self.generate_safe_filename(original_filename)
            file_path = self.upload_dir / safe_filename
            
            # Validate file
            is_valid, message = self.validate_file(str(file_path), len(file_content))
            if not is_valid:
                logger.warning(f"File validation failed: {message}")
                return None
            
            # Write file
            with open(file_path, 'wb') as f:
                f.write(file_content)
            
            logger.info(f"File saved safely: {file_path}")
            return str(file_path)
            
        except Exception as e:
            logger.error(f"Error saving file: {e}")
            return None
    
    def read_file_safely(self, file_path: str) -> Optional[bytes]:
        """Read file with security checks."""
        try:
            # Normalize path to prevent path traversal
            normalized_path = Path(file_path).resolve()
            
            # Ensure file is within upload directory
            if not str(normalized_path).startswith(str(self.upload_dir.resolve())):
                logger.warning(f"Attempted path traversal: {file_path}")
                return None
            
            # Check if file exists
            if not normalized_path.exists():
                logger.warning(f"File not found: {file_path}")
                return None
            
            # Read file
            with open(normalized_path, 'rb') as f:
                content = f.read()
            
            return content
            
        except Exception as e:
            logger.error(f"Error reading file: {e}")
            return None
    
    def delete_file_safely(self, file_path: str) -> bool:
        """Delete file with security checks."""
        try:
            # Normalize path to prevent path traversal
            normalized_path = Path(file_path).resolve()
            
            # Ensure file is within upload directory
            if not str(normalized_path).startswith(str(self.upload_dir.resolve())):
                logger.warning(f"Attempted path traversal during deletion: {file_path}")
                return False
            
            # Check if file exists
            if not normalized_path.exists():
                logger.warning(f"File not found for deletion: {file_path}")
                return False
            
            # Delete file
            normalized_path.unlink()
            logger.info(f"File deleted safely: {file_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting file: {e}")
            return False

# Usage
file_handler = SecureFileHandler(upload_dir="uploads", max_file_size=5*1024*1024)

# Save file safely
file_content = b"Hello, this is a test file"
saved_path = file_handler.save_file_safely(file_content, "test.txt")

if saved_path:
    # Read file safely
    content = file_handler.read_file_safely(saved_path)
    if content:
        print(f"File content: {content.decode()}")
    
    # Delete file safely
    file_handler.delete_file_safely(saved_path)
```

### Secure File Upload with Flask
```python
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Configure upload settings
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/upload', methods=['POST'])
def upload_file():
    """Secure file upload endpoint."""
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file was selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Generate unique filename to prevent overwrites
        import uuid
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        
        # Save file
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': unique_filename
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Upload failed'}), 500

# Usage
if __name__ == '__main__':
    app.run(debug=False)
```

## Common Security Pitfalls and Prevention

### XSS Prevention
```python
import html
import re
from typing import Any, Dict, List

class XSSPrevention:
    """XSS prevention utilities."""
    
    def __init__(self):
        # Dangerous HTML tags and attributes
        self.dangerous_tags = {
            'script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea',
            'select', 'button', 'link', 'meta', 'style', 'base', 'xml'
        }
        
        self.dangerous_attributes = {
            'onload', 'onerror', 'onclick', 'onmouseover', 'onfocus', 'onblur',
            'onchange', 'onsubmit', 'onreset', 'onselect', 'onunload',
            'javascript:', 'vbscript:', 'data:'
        }
    
    def sanitize_html(self, content: str) -> str:
        """Sanitize HTML content to prevent XSS."""
        # Remove dangerous HTML tags
        for tag in self.dangerous_tags:
            pattern = re.compile(f'<{tag}[^>]*>.*?</{tag}>', re.IGNORECASE | re.DOTALL)
            content = pattern.sub('', content)
        
        # Remove dangerous attributes
        for attr in self.dangerous_attributes:
            pattern = re.compile(f'{attr}\\s*=\\s*["\'][^"\']*["\']', re.IGNORECASE)
            content = pattern.sub('', content)
        
        # Escape remaining HTML
        content = html.escape(content)
        
        return content
    
    def validate_url(self, url: str) -> str:
        """Validate and sanitize URLs to prevent XSS."""
        # Remove javascript: and data: URLs
        if url.lower().startswith(('javascript:', 'data:', 'vbscript:')):
            return ''
        
        # Basic URL validation
        if not url.startswith(('http://', 'https://')):
            return ''
        
        return url
    
    def sanitize_json(self, data: Any) -> Any:
        """Recursively sanitize JSON data."""
        if isinstance(data, str):
            return self.sanitize_html(data)
        elif isinstance(data, dict):
            return {key: self.sanitize_json(value) for key, value in data.items()}
        elif isinstance(data, list):
            return [self.sanitize_json(item) for item in data]
        else:
            return data

# Usage
xss_prevention = XSSPrevention()

# Sanitize user input
user_input = "<script>alert('xss')</script><p>Hello</p>"
sanitized = xss_prevention.sanitize_html(user_input)
print(f"Sanitized: {sanitized}")

# Validate URL
dangerous_url = "javascript:alert('xss')"
safe_url = xss_prevention.validate_url(dangerous_url)
print(f"Safe URL: {safe_url}")
```

### CSRF Protection
```python
import secrets
import hashlib
import time
from typing import Optional

class CSRFProtection:
    """CSRF protection implementation."""
    
    def __init__(self, secret_key: str):
        self.secret_key = secret_key
        self.tokens = {}  # In production, use Redis or database
    
    def generate_token(self, user_id: str) -> str:
        """Generate CSRF token for user."""
        # Create token with timestamp
        timestamp = str(int(time.time()))
        random_part = secrets.token_hex(16)
        
        # Create token hash
        token_data = f"{user_id}:{timestamp}:{random_part}"
        token_hash = hashlib.sha256(f"{self.secret_key}:{token_data}".encode()).hexdigest()
        
        # Store token with expiration (1 hour)
        token = f"{timestamp}:{random_part}:{token_hash}"
        self.tokens[user_id] = {
            'token': token,
            'expires': time.time() + 3600
        }
        
        return token
    
    def validate_token(self, user_id: str, token: str) -> bool:
        """Validate CSRF token."""
        if user_id not in self.tokens:
            return False
        
        stored_data = self.tokens[user_id]
        
        # Check expiration
        if time.time() > stored_data['expires']:
            del self.tokens[user_id]
            return False
        
        # Validate token
        if token != stored_data['token']:
            return False
        
        return True
    
    def invalidate_token(self, user_id: str):
        """Invalidate CSRF token."""
        if user_id in self.tokens:
            del self.tokens[user_id]

# Usage
csrf = CSRFProtection("your-secret-key")

# Generate token
user_id = "user123"
token = csrf.generate_token(user_id)
print(f"Generated token: {token}")

# Validate token
is_valid = csrf.validate_token(user_id, token)
print(f"Token valid: {is_valid}")

# Invalidate token
csrf.invalidate_token(user_id)
```

### Rate Limiting
```python
import time
from collections import defaultdict
from typing import Dict, Tuple

class RateLimiter:
    """Simple rate limiter implementation."""
    
    def __init__(self, max_requests: int = 100, window_seconds: int = 3600):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
    
    def is_allowed(self, identifier: str) -> Tuple[bool, Dict]:
        """Check if request is allowed."""
        now = time.time()
        
        # Clean old requests
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if now - req_time < self.window_seconds
        ]
        
        # Check if limit exceeded
        if len(self.requests[identifier]) >= self.max_requests:
            return False, {
                'allowed': False,
                'remaining': 0,
                'reset_time': min(self.requests[identifier]) + self.window_seconds
            }
        
        # Add current request
        self.requests[identifier].append(now)
        
        return True, {
            'allowed': True,
            'remaining': self.max_requests - len(self.requests[identifier]),
            'reset_time': now + self.window_seconds
        }
    
    def get_remaining(self, identifier: str) -> int:
        """Get remaining requests for identifier."""
        now = time.time()
        
        # Clean old requests
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if now - req_time < self.window_seconds
        ]
        
        return max(0, self.max_requests - len(self.requests[identifier]))

# Usage
rate_limiter = RateLimiter(max_requests=10, window_seconds=60)

# Check rate limit
client_ip = "192.168.1.1"
allowed, info = rate_limiter.is_allowed(client_ip)

if allowed:
    print(f"Request allowed. Remaining: {info['remaining']}")
else:
    print(f"Rate limit exceeded. Reset at: {info['reset_time']}")
```

---

[Previous Chapter](15-deployment.md) | [Next Chapter](cheatsheet.md)
