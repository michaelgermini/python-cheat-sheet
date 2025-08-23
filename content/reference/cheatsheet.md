# Python Professional Cheat Sheet - Quick Reference

## 🐍 Python Basics

### Variables & Data Types
```python
# Numbers: fundamental numeric data types for mathematical operations
x = 10          # int: whole number (integer) for counting and indexing
y = 3.14        # float: decimal number (floating point) for precise calculations
z = 1 + 2j      # complex: complex number with real and imaginary parts for advanced math

# Strings: text data with various quote styles for flexible text handling
name = "Python" # str: single or double quotes for simple strings
text = '''Multi-line
string'''       # Triple quotes for multi-line strings and documentation

# Collections: data structures for organizing multiple values efficiently
my_list = [1, 2, 3]           # list: ordered, mutable sequence for dynamic data
my_tuple = (1, 2, 3)          # tuple: ordered, immutable sequence for fixed data
my_dict = {"key": "value"}     # dict: key-value pairs (mapping) for associative data
my_set = {1, 2, 3}            # set: unordered collection of unique elements for distinct values

# Booleans: logical values for conditional logic and control flow
is_valid = True                # True: represents truth condition for positive logic
is_empty = False               # False: represents false condition for negative logic

# Type hints: optional annotations for better code documentation and IDE support
age: int = 25                  # Explicitly typed integer variable for clarity
name: str = "John"             # Explicitly typed string variable for documentation
scores: List[int] = [85, 90, 78]  # List containing integers with type annotation for validation
```

### Control Structures
```python
# If/elif/else: conditional execution based on boolean expressions for decision making
if x > 0:
    print("Positive")          # Execute if x is greater than 0 (positive number)
elif x == 0:
    print("Zero")              # Execute if x equals 0 (only if previous conditions were False)
else:
    print("Negative")          # Execute if all previous conditions were False (negative number)

# Ternary operator: concise conditional expression for simple decisions in one line
result = "Even" if x % 2 == 0 else "Odd"  # Assign "Even" if x is even, "Odd" if x is odd

# Loops: iterative execution for processing sequences and repeated operations efficiently
for item in my_list:
    print(item)                # Iterate over each item in the list (sequence iteration)

for i in range(10):
    print(i)                   # Iterate over numbers 0 to 9 (range generates sequence)

while condition:
    # do something              # Execute loop body while condition is True (conditional iteration)
    break  # or continue        # break: exit loop immediately, continue: skip to next iteration

# List comprehensions: concise way to create lists from iterables with optional filtering
squares = [x**2 for x in range(10)]        # Create list of squares for numbers 0-9 (transformation)
evens = [x for x in range(10) if x % 2 == 0]  # Create list of even numbers 0-9 with filtering (conditional)
```

### Functions
```python
# Basic function: reusable code block with parameters and return value for modular programming
def greet(name: str) -> str:  # Function with type hints for parameter and return value
    return f"Hello, {name}!"  # Return formatted greeting string with f-string interpolation

# Default arguments: parameters with predefined values if no argument provided for convenience
def power(base, exponent=2):  # exponent has default value of 2 for common use case
    return base ** exponent   # Return base raised to the power of exponent using ** operator

# *args and **kwargs: variable arguments for flexible function signatures and dynamic behavior
def flexible_func(*args, **kwargs):  # *args: variable positional arguments, **kwargs: variable keyword arguments
    print(f"Args: {args}")           # Print tuple of positional arguments for debugging
    print(f"Kwargs: {kwargs}")       # Print dictionary of keyword arguments for debugging

# Lambda functions: anonymous functions for simple operations and functional programming
square = lambda x: x**2              # Lambda function to square a number (inline function)
add = lambda x, y: x + y             # Lambda function to add two numbers (inline function)

# Decorators: functions that modify or enhance other functions with cross-cutting concerns
def timer(func):  # Decorator function that takes a function as parameter for enhancement
    def wrapper(*args, **kwargs):  # Inner function that wraps the original function with timing
        import time
        start = time.time()        # Record start time before function execution for performance measurement
        result = func(*args, **kwargs)  # Call the original function with all arguments (preserve signature)
        end = time.time()          # Record end time after function execution for duration calculation
        print(f"{func.__name__} took {end-start:.4f} seconds")  # Print execution time with function name
        return result              # Return the original function's result (preserve return value)
    return wrapper                 # Return the wrapper function (decorator pattern)

@timer  # Decorator syntax: apply timer decorator to function for automatic timing
def slow_function():
    import time
    time.sleep(1)  # Simulate slow operation for demonstration purposes
```

## 🏗️ Object-Oriented Programming

### Classes
```python
class Person:
    def __init__(self, name: str, age: int):  # Constructor method: initialize object attributes on creation
        self.name = name  # Instance attribute: unique to each Person object (encapsulation)
        self.age = age    # Instance attribute: unique to each Person object (encapsulation)
    
    def greet(self) -> str:  # Instance method: behavior specific to each person (polymorphism)
        return f"Hello, I'm {self.name}"  # Return personalized greeting with f-string interpolation
    
    @property
    def is_adult(self) -> bool:  # Property decorator: computed attribute that behaves like a field (getter)
        return self.age >= 18    # Return True if person is 18 or older (business logic)
    
    @classmethod
    def create_anonymous(cls):  # Class method: operates on the class itself, not instances (factory pattern)
        return cls("Anonymous", 0)  # Create and return a new Person instance with default values
    
    @staticmethod
    def validate_age(age: int) -> bool:  # Static method: utility function not tied to class or instance
        return 0 <= age <= 150  # Return True if age is within valid range (validation logic)

# Inheritance: create specialized classes that inherit from base classes for code reuse
class Employee(Person):  # Employee inherits all methods and attributes from Person (inheritance)
    def __init__(self, name: str, age: int, salary: float):  # Constructor with additional parameter
        super().__init__(name, age)  # Call parent class constructor to initialize inherited attributes
        self.salary = salary  # Employee-specific attribute (extension)
    
    def get_salary_info(self) -> str:  # Employee-specific method (specialization)
        return f"Salary: ${self.salary:,.2f}"  # Return formatted salary information with currency formatting

# Dataclasses: automatically generate boilerplate code for simple data containers (reduced boilerplate)
from dataclasses import dataclass  # Import dataclass decorator for automatic code generation

@dataclass
class Point:  # Dataclass automatically generates __init__, __repr__, __eq__, etc. (convenience)
    x: float  # Type-annotated field for automatic validation
    y: float  # Type-annotated field for automatic validation
    
    def distance(self, other: 'Point') -> float:  # Custom method for distance calculation (geometry)
        return ((self.x - other.x)**2 + (self.y - other.y)**2)**0.5  # Euclidean distance formula (mathematics)
```

### Magic Methods
```python
class Vector:
    def __init__(self, x: float, y: float):  # Constructor: initialize vector components for mathematical operations
        self.x = x  # X-component of the vector (horizontal component)
        self.y = y  # Y-component of the vector (vertical component)
    
    def __str__(self) -> str:  # String representation for user-friendly output (str() function)
        return f"Vector({self.x}, {self.y})"  # Human-readable format with f-string interpolation
    
    def __repr__(self) -> str:  # Detailed string representation for debugging (repr() function)
        return f"Vector({self.x}, {self.y})"  # Developer-friendly format (same as __str__ in this case)
    
    def __add__(self, other: 'Vector') -> 'Vector':  # Addition operator: vector + vector (operator overloading)
        return Vector(self.x + other.x, self.y + other.y)  # Return new vector with summed components (vector addition)
    
    def __eq__(self, other: 'Vector') -> bool:  # Equality operator: vector == vector (comparison)
        return self.x == other.x and self.y == other.y  # Return True if all components match (component-wise equality)
    
    def __len__(self) -> int:  # Length operator: len(vector) returns magnitude (custom behavior)
        return int((self.x**2 + self.y**2)**0.5)  # Calculate vector magnitude using Pythagorean theorem (mathematics)
```

## 📚 Popular Libraries

### NumPy
```python
import numpy as np

# Arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.array([[1, 2], [3, 4]])

# Operations
arr + 2                    # Broadcasting
arr * 3                    # Element-wise multiplication
np.dot(matrix, matrix)     # Matrix multiplication
arr.reshape(2, 3)          # Reshape
arr.flatten()              # Flatten

# Indexing
arr[1:4]                   # Slicing
arr[arr > 3]               # Boolean indexing
arr[[0, 2, 4]]             # Fancy indexing

# Functions
np.mean(arr)               # Mean
np.std(arr)                # Standard deviation
np.max(arr)                # Maximum
np.min(arr)                # Minimum
np.sum(arr)                # Sum
```

### Pandas
```python
import pandas as pd

# Series and DataFrames
series = pd.Series([1, 2, 3, 4], index=['a', 'b', 'c', 'd'])
df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['NYC', 'LA', 'Chicago']
})

# Reading data
df = pd.read_csv('data.csv')
df = pd.read_excel('data.xlsx')
df = pd.read_json('data.json')

# Basic operations
df.head()                  # First 5 rows
df.tail()                  # Last 5 rows
df.info()                  # DataFrame info
df.describe()              # Statistical summary
df.shape                   # Dimensions

# Filtering and selection
df[df['age'] > 30]         # Filter rows
df[['name', 'age']]        # Select columns
df.loc[0:2, 'name']        # Label-based indexing
df.iloc[0:2, 0:2]          # Integer-based indexing

# Grouping and aggregation
df.groupby('city')['age'].mean()
df.groupby('city').agg({'age': ['mean', 'std'], 'name': 'count'})

# Merging
pd.merge(df1, df2, on='id', how='inner')
df1.join(df2, on='id')
```

### Matplotlib & Seaborn
```python
import matplotlib.pyplot as plt
import seaborn as sns

# Basic plotting
plt.plot(x, y, 'b-', label='Line')
plt.scatter(x, y, c=colors, alpha=0.6)
plt.bar(categories, values)
plt.hist(data, bins=30)

# Subplots
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
axes[0, 0].plot(x, y)
axes[0, 1].scatter(x, y)

# Seaborn
sns.lineplot(data=df, x='x', y='y', hue='category')
sns.boxplot(data=df, x='category', y='value')
sns.heatmap(correlation_matrix, annot=True)
sns.pairplot(df, hue='target')

# Styling
plt.title('My Plot')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

## 🌐 Web Development

### Flask
```python
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/users', methods=['GET', 'POST'])
def users():
    if request.method == 'POST':
        data = request.get_json()
        # Process data
        return jsonify({'message': 'User created'}), 201
    else:
        # Return users
        return jsonify({'users': []})

@app.route('/user/<int:user_id>')
def get_user(user_id):
    return jsonify({'id': user_id, 'name': 'John'})

if __name__ == '__main__':
    app.run(debug=True)
```

### FastAPI
```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

class User(BaseModel):
    name: str
    email: str
    age: Optional[int] = None

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/users/{user_id}")
def read_user(user_id: int):
    return {"user_id": user_id}

@app.post("/users/")
def create_user(user: User):
    return user

@app.get("/items/")
def read_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}
```

## 🧪 Testing

### Pytest
```python
import pytest

def add(a: int, b: int) -> int:
    return a + b

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

def test_add_negative():
    assert add(-2, -3) == -5

@pytest.fixture
def sample_data():
    return [1, 2, 3, 4, 5]

def test_with_fixture(sample_data):
    assert len(sample_data) == 5
    assert sum(sample_data) == 15

@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected
```

### Mocking
```python
from unittest.mock import Mock, patch

def test_with_mock():
    mock_obj = Mock()
    mock_obj.method.return_value = "mocked result"
    
    assert mock_obj.method() == "mocked result"
    mock_obj.method.assert_called_once()

@patch('module.external_api_call')
def test_with_patch(mock_api):
    mock_api.return_value = {'status': 'success'}
    
    result = function_that_calls_api()
    assert result['status'] == 'success'
    mock_api.assert_called_once()
```

## 🐛 Debugging

### Logging
```python
import logging

# Basic logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
logger.info("Info message")
logger.error("Error message")
logger.debug("Debug message")

# Structured logging
logger.info("User action", extra={
    'user_id': 123,
    'action': 'login',
    'ip': '192.168.1.1'
})
```

### Exception Handling
```python
try:
    result = risky_operation()
except ValueError as e:
    logger.error(f"Value error: {e}")
    result = None
except FileNotFoundError as e:
    logger.error(f"File not found: {e}")
    result = None
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    raise
else:
    logger.info("Operation successful")
finally:
    cleanup_resources()
```

### Debugger
```python
import pdb

def debug_function():
    x = 10
    y = 20
    pdb.set_trace()  # or breakpoint() in Python 3.7+
    result = x + y
    return result

# Debugger commands:
# n (next), s (step), c (continue), l (list), p (print), q (quit)
```

## 🚀 Performance & Optimization

### Profiling
```python
import cProfile
import timeit

# cProfile
def profile_function():
    profiler = cProfile.Profile()
    profiler.enable()
    # Your code here
    profiler.disable()
    profiler.print_stats(sort='cumulative')

# timeit
execution_time = timeit.timeit(
    'your_function()',
    setup='from __main__ import your_function',
    number=1000
)
print(f"Average time: {execution_time/1000:.6f} seconds")
```

### Memory Optimization
```python
# Generators for memory efficiency
def fibonacci_generator(n):
    a, b = 0, 1
    while a < n:
        yield a
        a, b = b, a + b

# Use __slots__ for memory-efficient classes
class Point:
    __slots__ = ['x', 'y']
    
    def __init__(self, x, y):
        self.x = x
        self.y = y

# Weak references to avoid circular references
import weakref

class Cache:
    def __init__(self):
        self._cache = weakref.WeakValueDictionary()
```

## 🔒 Security

### Environment Variables
```python
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')
API_KEY = os.getenv('API_KEY')
```

### Input Validation
```python
import re
import html

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_html(text: str) -> str:
    return html.escape(text)

def validate_password(password: str) -> bool:
    # At least 8 chars, uppercase, lowercase, number, special char
    pattern = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
    return re.match(pattern, password) is not None
```

## 📦 Package Management

### Virtual Environments
```bash
# Create virtual environment
python -m venv myenv

# Activate (Windows)
myenv\Scripts\activate

# Activate (Unix/MacOS)
source myenv/bin/activate

# Deactivate
deactivate

# Install packages
pip install package_name
pip install -r requirements.txt

# Generate requirements
pip freeze > requirements.txt
```

### Project Structure
```
myproject/
├── myproject/
│   ├── __init__.py
│   ├── core.py
│   ├── utils.py
│   └── models.py
├── tests/
│   ├── __init__.py
│   ├── test_core.py
│   └── test_utils.py
├── docs/
├── requirements.txt
├── setup.py
├── pyproject.toml
├── README.md
└── .gitignore
```

## 🔧 Common Patterns

### Context Managers
```python
# Custom context manager
class DatabaseConnection:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.connection = None
    
    def __enter__(self):
        print(f"Connecting to {self.host}:{self.port}")
        self.connection = "connected"
        return self.connection
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing connection")
        self.connection = None

# Usage
with DatabaseConnection("localhost", 5432) as conn:
    print(f"Using connection: {conn}")
```

### Decorators
```python
import functools
import time

def retry(max_attempts=3, delay=1.0):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

@retry(max_attempts=3, delay=0.5)
def unreliable_function():
    import random
    if random.random() < 0.7:
        raise ValueError("Random failure")
    return "Success!"
```

### Generators
```python
def read_large_file(filename):
    """Read large file line by line."""
    with open(filename, 'r') as f:
        for line in f:
            yield line.strip()

def infinite_counter():
    """Infinite counter generator."""
    num = 0
    while True:
        yield num
        num += 1

# Usage
for line in read_large_file('large_file.txt'):
    process_line(line)

counter = infinite_counter()
for i in range(10):
    print(next(counter))
```

## 🎯 Best Practices

### Code Style (PEP 8)
```python
# Naming conventions
class UserAccount:          # PascalCase for classes
    def __init__(self):
        self.user_name = "" # snake_case for variables
        self.MAX_RETRIES = 3 # UPPER_CASE for constants

def calculate_score():      # snake_case for functions
    pass

# Line length: 79 characters (88 with black)
long_string = (
    "This is a very long string that needs to be "
    "broken across multiple lines for readability"
)

# Import organization
import os
import sys
from datetime import datetime
from typing import List, Dict

import numpy as np
import pandas as pd

from .models import User
from .utils import helper_function
```

### Type Hints
```python
from typing import List, Dict, Optional, Union, Tuple, Callable

def process_data(
    items: List[Dict[str, Union[str, int, float]]],
    callback: Optional[Callable[[str], bool]] = None
) -> Tuple[List[str], int]:
    """Process a list of dictionaries with optional callback."""
    processed = []
    count = 0
    
    for item in items:
        if callback and callback(str(item)):
            processed.append(str(item))
            count += 1
    
    return processed, count
```

### Documentation
```python
def complex_function(param1: str, param2: int, optional_param: bool = True) -> str:
    """
    Perform a complex operation on the given parameters.
    
    Args:
        param1: A string parameter that describes something important.
        param2: An integer parameter that controls the operation.
        optional_param: An optional boolean parameter. Defaults to True.
    
    Returns:
        A string containing the result of the operation.
    
    Raises:
        ValueError: If param2 is negative.
        TypeError: If param1 is not a string.
    
    Example:
        >>> result = complex_function("test", 42)
        >>> print(result)
        'Processed: test with value 42'
    """
    if param2 < 0:
        raise ValueError("param2 must be non-negative")
    
    if not isinstance(param1, str):
        raise TypeError("param1 must be a string")
    
    result = f"Processed: {param1} with value {param2}"
    if optional_param:
        result += " (optional enabled)"
    
    return result
```

---

## 🚀 Quick Commands

### Git
```bash
git init                    # Initialize repository
git add .                   # Stage all files
git commit -m "Message"     # Commit changes
git push origin main        # Push to remote
git pull origin main        # Pull from remote
git branch feature-branch   # Create branch
git checkout feature-branch # Switch branch
git merge feature-branch    # Merge branch
```

### Package Management
```bash
pip install package         # Install package
pip install -r req.txt      # Install from requirements
pip freeze > req.txt        # Save requirements
python -m venv env          # Create virtual environment
source env/bin/activate     # Activate environment
deactivate                  # Deactivate environment
```

### Testing
```bash
pytest                     # Run all tests
pytest test_file.py        # Run specific test file
pytest -v                  # Verbose output
pytest -k "test_name"      # Run specific test
pytest --cov=app           # Run with coverage
```

### Code Quality
```bash
black .                    # Format code
flake8 .                   # Lint code
mypy .                     # Type checking
isort .                    # Sort imports
```

---

*This cheat sheet covers the most essential Python concepts for professional development. For detailed explanations, refer to the individual chapter files.*
