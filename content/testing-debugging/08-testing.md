# Testing (Unit Tests, Pytest, Test Coverage)

## Unit Testing Basics

### Writing Simple Tests
```python
import unittest  # Import the unittest framework for writing and running tests

def add(a, b):  # Function to be tested (simple addition function)
    return a + b

class TestMathFunctions(unittest.TestCase):  # Test class inherits from TestCase (required for unittest)
    def test_add_positive_numbers(self):     # Test method for positive numbers (method name must start with 'test_')
        result = add(2, 3)                   # Call function with test data (input values)
        self.assertEqual(result, 5)          # Assert expected result (verify output matches expectation)
    
    def test_add_negative_numbers(self):     # Test method for negative numbers (different test scenario)
        result = add(-1, -2)                 # Call function with test data (negative input values)
        self.assertEqual(result, -3)         # Assert expected result (verify output matches expectation)
    
    def test_add_zero(self):                 # Test method for zero (edge case testing)
        result = add(5, 0)                   # Call function with test data (one input is zero)
        self.assertEqual(result, 5)          # Assert expected result (verify output matches expectation)

if __name__ == '__main__':                   # Run tests if file is executed directly (not imported)
    unittest.main()                          # Execute all test methods in the class (discover and run tests)
```

### Test Assertions
```python
import unittest  # Import the unittest framework for writing and running tests

class TestAssertions(unittest.TestCase):  # Test class for demonstrating different assertion types
    def test_assertions(self):            # Test method showing various assertion methods available
        # Equality assertions: check if values are equal or not equal
        self.assertEqual(2 + 2, 4)        # Assert that 2+2 equals 4 (exact equality)
        self.assertNotEqual(2 + 2, 5)     # Assert that 2+2 does not equal 5 (inequality check)
        
        # Truthiness assertions: check boolean conditions and truth values
        self.assertTrue(True)             # Assert that True is True (boolean truth check)
        self.assertFalse(False)           # Assert that False is False (boolean false check)
        
        # Membership assertions: check if items are in collections (lists, tuples, sets, etc.)
        self.assertIn(1, [1, 2, 3])       # Assert that 1 is in the list [1, 2, 3]
        self.assertNotIn(4, [1, 2, 3])    # Assert that 4 is not in the list [1, 2, 3]
        
        # Type checking assertions: verify object types and inheritance
        self.assertIsInstance("hello", str)    # Assert that "hello" is a string (type check)
        self.assertIsInstance([1, 2, 3], list) # Assert that [1,2,3] is a list (type check)
        
        # Approximate equality: for floating point comparisons (handles precision issues)
        self.assertAlmostEqual(3.14159, 3.14, places=2)  # Compare with 2 decimal places (tolerance for floating point)
        
        # Exception assertions: verify that exceptions are raised when expected
        with self.assertRaises(ValueError):              # Assert that ValueError is raised (exception type check)
            int("not a number")                          # This should raise ValueError (invalid conversion)
        
        with self.assertRaisesRegex(ValueError, "invalid literal"):  # Assert specific error message (exception message check)
            int("not a number")                          # This should raise ValueError with specific message pattern
```

## Pytest

### Installation
```bash
pip install pytest pytest-cov pytest-mock
```

### Basic Pytest Tests
```python
# test_calculator.py - Pytest test file for calculator functions
def add(a, b):  # Function to add two numbers (simple addition)
    return a + b

def multiply(a, b):  # Function to multiply two numbers (simple multiplication)
    return a * b

def divide(a, b):  # Function to divide two numbers (with error handling)
    if b == 0:     # Check for division by zero (edge case validation)
        raise ValueError("Cannot divide by zero")  # Raise exception for invalid input
    return a / b

# Test functions using pytest (no class needed - simpler than unittest)
def test_add():  # Test function for addition (function name must start with 'test_')
    assert add(2, 3) == 5      # Test positive numbers (simple assertion)
    assert add(-1, 1) == 0     # Test negative and positive (edge case)
    assert add(0, 0) == 0      # Test zeros (boundary case)

def test_multiply():  # Test function for multiplication (different test scenario)
    assert multiply(2, 3) == 6   # Test positive numbers (basic functionality)
    assert multiply(-2, 3) == -6 # Test negative and positive (sign handling)
    assert multiply(0, 5) == 0   # Test with zero (zero multiplication property)

def test_divide():  # Test function for division (normal cases)
    assert divide(6, 2) == 3     # Test integer division (exact result)
    assert divide(5, 2) == 2.5   # Test float division (decimal result)
    assert divide(-6, 2) == -3   # Test negative division (sign preservation)

def test_divide_by_zero():  # Test function for division by zero (exception testing)
    import pytest  # Import pytest for exception testing
    with pytest.raises(ValueError, match="Cannot divide by zero"):  # Assert exception with message match
        divide(5, 0)  # This should raise ValueError with specific message
```

### Pytest Fixtures
```python
import pytest  # Import pytest for advanced testing features

@pytest.fixture
def sample_data():  # Fixture that provides test data (reusable across multiple tests)
    return [1, 2, 3, 4, 5]  # Return sample list for testing

@pytest.fixture
def empty_list():  # Fixture that provides empty list for edge case testing
    return []  # Return empty list for testing

@pytest.fixture
def user_data():  # Fixture that provides user data dictionary
    return {
        'name': 'Alice',  # User name for testing
        'age': 30,        # User age for testing
        'email': 'alice@example.com'  # User email for testing
    }

def test_list_operations(sample_data, empty_list):  # Test function using multiple fixtures
    assert len(sample_data) == 5  # Test that sample_data has 5 elements
    assert len(empty_list) == 0   # Test that empty_list has 0 elements
    assert 3 in sample_data       # Test that 3 is in the sample_data list

def test_user_info(user_data):  # Test function using user_data fixture
    assert user_data['name'] == 'Alice'  # Test user name field
    assert user_data['age'] == 30        # Test user age field
    assert '@' in user_data['email']     # Test that email contains @ symbol

# Fixture with setup and teardown: manages resources with proper cleanup
@pytest.fixture
def database_connection():  # Fixture that manages database connection lifecycle
    # Setup: create database connection before test
    connection = create_database_connection()  # Create connection (placeholder function)
    yield connection  # Provide connection to test function
    # Teardown: cleanup after test (runs after test completes)
    connection.close()  # Close connection to prevent resource leaks

def test_database_operations(database_connection):  # Test function using database fixture
    result = database_connection.execute("SELECT * FROM users")  # Execute database query
    assert len(result) > 0  # Assert that query returned at least one result
```

### Parameterized Tests
```python
import pytest  # Import pytest for parameterized testing

@pytest.mark.parametrize("input_a, input_b, expected", [  # Parameterized test decorator with multiple test cases
    (2, 3, 5),    # Test case 1: positive numbers
    (0, 0, 0),    # Test case 2: zeros
    (-1, 1, 0),   # Test case 3: negative and positive
    (10, 20, 30), # Test case 4: larger numbers
])
def test_add_parametrized(input_a, input_b, expected):  # Single test function that runs multiple test cases
    assert add(input_a, input_b) == expected  # Test assertion for each parameter combination

@pytest.mark.parametrize("input_str, expected", [  # Parameterized test for string operations
    ("hello", "HELLO"),   # Test case 1: lowercase to uppercase
    ("world", "WORLD"),   # Test case 2: another lowercase word
    ("", ""),             # Test case 3: empty string (edge case)
    ("Python", "PYTHON"), # Test case 4: mixed case to uppercase
])
def test_upper_case(input_str, expected):  # Test function for string uppercase conversion
    assert input_str.upper() == expected  # Test that uppercase conversion works correctly
```

### Test Markers
```python
import pytest  # Import pytest for test markers and categorization

@pytest.mark.slow  # Mark test as slow (can be filtered out for quick test runs)
def test_slow_operation():  # Test that takes a long time to execute
    # This test takes a long time (simulated slow operation)
    import time  # Import time module for sleep function
    time.sleep(2)  # Simulate slow operation (2 second delay)
    assert True  # Simple assertion (test passes if no exception)

@pytest.mark.integration  # Mark test as integration test (requires external dependencies)
def test_database_integration():  # Integration test for database operations
    # Integration test (requires database connection)
    pass  # Placeholder for actual integration test logic

@pytest.mark.unit  # Mark test as unit test (isolated, fast execution)
def test_unit_function():  # Unit test for individual function
    # Unit test (tests single function in isolation)
    pass  # Placeholder for actual unit test logic

@pytest.mark.skip(reason="Not implemented yet")  # Skip test with explanation
def test_future_feature():  # Test for feature that hasn't been implemented
    pass  # Test will be skipped during execution

@pytest.mark.xfail(reason="Known bug")  # Mark test as expected to fail
def test_known_bug():  # Test for known bug that hasn't been fixed
    assert False  # Test is expected to fail (known issue)
```

## Mocking

### Basic Mocking
```python
from unittest.mock import Mock, patch, MagicMock  # Import mocking utilities from unittest.mock
import pytest  # Import pytest for testing framework

# Simple mock: create mock object with predefined return value
mock_obj = Mock()  # Create a mock object
mock_obj.some_method.return_value = "mocked result"  # Set return value for method call
assert mock_obj.some_method() == "mocked result"  # Verify mock returns expected value

# Mock with side effects: mock that returns different values on each call
mock_obj = Mock()  # Create a new mock object
mock_obj.side_effect = [1, 2, 3]  # Set sequence of return values (returns 1, then 2, then 3)
assert mock_obj() == 1  # First call returns 1
assert mock_obj() == 2  # Second call returns 2
assert mock_obj() == 3  # Third call returns 3

# Mock with exceptions: mock that raises exceptions when called
mock_obj = Mock()  # Create a new mock object
mock_obj.side_effect = ValueError("Test exception")  # Set mock to raise ValueError
with pytest.raises(ValueError):  # Assert that ValueError is raised
    mock_obj()  # Call mock (should raise exception)
```

### Patching
```python
from unittest.mock import patch
import requests

def get_user_data(user_id):
    response = requests.get(f"https://api.example.com/users/{user_id}")
    return response.json()

# Patch the requests.get method
@patch('requests.get')
def test_get_user_data(mock_get):
    # Configure the mock
    mock_response = Mock()
    mock_response.json.return_value = {'id': 1, 'name': 'Alice'}
    mock_get.return_value = mock_response
    
    # Test the function
    result = get_user_data(1)
    
    # Assertions
    assert result == {'id': 1, 'name': 'Alice'}
    mock_get.assert_called_once_with('https://api.example.com/users/1')

# Context manager approach
def test_get_user_data_context():
    with patch('requests.get') as mock_get:
        mock_response = Mock()
        mock_response.json.return_value = {'id': 1, 'name': 'Alice'}
        mock_get.return_value = mock_response
        
        result = get_user_data(1)
        assert result == {'id': 1, 'name': 'Alice'}
```

### Mocking Classes
```python
from unittest.mock import Mock, patch

class DatabaseConnection:
    def __init__(self, host, port):
        self.host = host
        self.port = port
    
    def execute(self, query):
        # Simulate database operation
        return [{'id': 1, 'name': 'Alice'}]

def get_user_by_id(db_connection, user_id):
    result = db_connection.execute(f"SELECT * FROM users WHERE id = {user_id}")
    return result[0] if result else None

# Test with mocked database
def test_get_user_by_id():
    # Create a mock database connection
    mock_db = Mock()
    mock_db.execute.return_value = [{'id': 1, 'name': 'Alice'}]
    
    # Test the function
    result = get_user_by_id(mock_db, 1)
    
    # Assertions
    assert result == {'id': 1, 'name': 'Alice'}
    mock_db.execute.assert_called_once_with("SELECT * FROM users WHERE id = 1")
```

## Test Coverage

### Running Coverage
```bash
# Install coverage
pip install coverage

# Run tests with coverage
coverage run -m pytest

# Generate coverage report
coverage report

# Generate HTML coverage report
coverage html
```

### Coverage Configuration
```ini
# .coveragerc
[run]
source = myproject
omit = 
    */tests/*
    */venv/*
    */migrations/*

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise AssertionError
    raise NotImplementedError
```

### Pytest Coverage
```python
# pytest.ini
[tool:pytest]
addopts = --cov=myproject --cov-report=html --cov-report=term-missing
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
```

## Advanced Testing Patterns

### Test Classes and Organization
```python
import pytest

class TestUserManagement:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.users = []
    
    def test_create_user(self):
        user = {'id': 1, 'name': 'Alice'}
        self.users.append(user)
        assert len(self.users) == 1
        assert self.users[0]['name'] == 'Alice'
    
    def test_delete_user(self):
        user = {'id': 1, 'name': 'Alice'}
        self.users.append(user)
        self.users.remove(user)
        assert len(self.users) == 0

class TestDataValidation:
    def test_valid_email(self):
        assert is_valid_email("test@example.com")
    
    def test_invalid_email(self):
        assert not is_valid_email("invalid-email")
```

### Test Data Factories
```python
import pytest
from dataclasses import dataclass

@dataclass
class User:
    id: int
    name: str
    email: str
    age: int

class UserFactory:
    @staticmethod
    def create_user(name="Test User", email="test@example.com", age=25):
        return User(id=1, name=name, email=email, age=age)
    
    @staticmethod
    def create_users(count=3):
        return [UserFactory.create_user(f"User {i}") for i in range(count)]

def test_user_creation():
    user = UserFactory.create_user("Alice", "alice@example.com", 30)
    assert user.name == "Alice"
    assert user.email == "alice@example.com"
    assert user.age == 30

def test_multiple_users():
    users = UserFactory.create_users(5)
    assert len(users) == 5
    assert all(user.name.startswith("User") for user in users)
```

### Integration Tests
```python
import pytest
from unittest.mock import patch

class TestAPIIntegration:
    @patch('requests.get')
    def test_api_user_fetch(self, mock_get):
        # Mock external API
        mock_response = Mock()
        mock_response.json.return_value = {'id': 1, 'name': 'Alice'}
        mock_response.status_code = 200
        mock_get.return_value = mock_response
        
        # Test API integration
        result = fetch_user_from_api(1)
        assert result['name'] == 'Alice'
    
    def test_database_integration(self):
        # Real database test (use test database)
        db = create_test_database()
        user_id = db.create_user("Alice", "alice@example.com")
        user = db.get_user(user_id)
        assert user['name'] == "Alice"
        db.cleanup()
```

### Performance Testing
```python
import pytest
import time

def test_function_performance():
    start_time = time.time()
    result = expensive_function()
    end_time = time.time()
    
    execution_time = end_time - start_time
    assert execution_time < 1.0  # Should complete within 1 second
    assert result is not None

@pytest.mark.benchmark
def test_benchmark(benchmark):
    result = benchmark(expensive_function)
    assert result is not None
```

## Testing Best Practices

### Test Organization
```python
# tests/
# ├── __init__.py
# ├── test_unit/
# │   ├── test_models.py
# │   ├── test_utils.py
# │   └── test_validators.py
# ├── test_integration/
# │   ├── test_api.py
# │   └── test_database.py
# └── conftest.py

# conftest.py - Shared fixtures
import pytest

@pytest.fixture(scope="session")
def database():
    # Setup test database
    db = create_test_database()
    yield db
    # Cleanup
    db.drop_all()

@pytest.fixture
def sample_user():
    return {
        'name': 'Test User',
        'email': 'test@example.com',
        'age': 25
    }
```

### Test Documentation
```python
def test_user_registration():
    """
    Test user registration functionality.
    
    Given: A valid user registration form
    When: The form is submitted
    Then: A new user should be created in the database
    """
    # Arrange
    user_data = {
        'name': 'Alice',
        'email': 'alice@example.com',
        'password': 'secure123'
    }
    
    # Act
    result = register_user(user_data)
    
    # Assert
    assert result.success is True
    assert result.user_id is not None
```

### Continuous Integration
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.8, 3.9, 3.10]
    
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v2
      with:
        python-version: ${{ matrix.python-version }}
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install pytest pytest-cov
    - name: Run tests
      run: |
        pytest --cov=myproject --cov-report=xml
    - name: Upload coverage
      uses: codecov/codecov-action@v1
```

---

[Previous Chapter](07-web.md) | [Next Chapter](09-debugging.md)
