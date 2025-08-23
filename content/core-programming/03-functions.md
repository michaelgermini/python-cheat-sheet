# Functions & Lambdas

## Function Definition

### Basic Function
```python
# Basic function definition: function without parameters
def greet():
    print("Hello, World!")  # Function body: code to execute when called

# Function call: execute the function
greet()  # Output: Hello, World!
```

### Function with Parameters
```python
# Function with parameter: accepts input value when called
def greet(name):  # Parameter 'name' receives the argument value
    print(f"Hello, {name}!")  # Use the parameter in the function body

# Function call with argument: pass value to the parameter
greet("Alice")  # Argument "Alice" is assigned to parameter 'name'
```

### Function with Return Value
```python
# Function with return value: sends data back to the caller
def add(a, b):  # Function with two parameters
    return a + b  # Return statement: sends result back to caller

# Function call with return value assignment
result = add(5, 3)  # Call function and store returned value in 'result'
```

### Function with Multiple Parameters
```python
# Function with multiple parameters including default value
def greet(name, age, city="Unknown"):  # 'city' has default value "Unknown"
    print(f"Hello, {name}! You are {age} years old from {city}.")

# Function calls with different argument patterns
greet("Alice", 30, "New York")  # All arguments provided
greet("Bob", 25)                # Missing 'city' argument, uses default value
```

## Parameter Types

### Positional Arguments
```python
# Positional arguments: arguments matched to parameters by position
def divide(a, b):  # First argument goes to 'a', second to 'b'
    return a / b   # Return the result of division

# Function call with positional arguments
result = divide(10, 2)  # 10 assigned to 'a', 2 assigned to 'b'
```

### Keyword Arguments
```python
# Keyword arguments: arguments matched to parameters by name
def create_person(name, age, city):  # Function with three parameters
    return {"name": name, "age": age, "city": city}  # Return dictionary

# Function call with keyword arguments (order doesn't matter)
person = create_person(name="Alice", age=30, city="NYC")  # Explicit parameter names
```

### Default Parameters
```python
# Default parameters: parameters with predefined values if no argument provided
def greet(name, greeting="Hello"):  # 'greeting' has default value "Hello"
    print(f"{greeting}, {name}!")   # Use the greeting parameter

# Function calls demonstrating default parameter usage
greet("Alice")      # Uses default greeting "Hello"
greet("Bob", "Hi")  # Overrides default with "Hi"
```

### Variable Arguments (*args)
```python
# Variable arguments (*args): accept any number of positional arguments
def sum_all(*numbers):  # *numbers collects all positional arguments into a tuple
    return sum(numbers)  # Use built-in sum() function on the tuple

# Function call with variable number of arguments
result = sum_all(1, 2, 3, 4, 5)  # All arguments collected into numbers tuple
```

### Keyword Variable Arguments (**kwargs)
```python
# Keyword variable arguments (**kwargs): accept any number of keyword arguments
def print_info(**kwargs):  # **kwargs collects all keyword arguments into a dictionary
    for key, value in kwargs.items():  # Iterate over key-value pairs
        print(f"{key}: {value}")       # Print each pair

# Function call with variable number of keyword arguments
print_info(name="Alice", age=30, city="NYC")  # All collected into kwargs dictionary
```

## Function Scope

### Local vs Global Variables
```python
# Variable scope: understanding where variables are accessible
global_var = "I'm global"  # Global variable: accessible throughout the module

def my_function():
    local_var = "I'm local"  # Local variable: only accessible within this function
    print(global_var)        # Can access global variables from inside function
    print(local_var)         # Can access local variables within function

# print(local_var)  # Error! local_var not accessible outside the function
```

### Global Keyword
```python
# Global keyword: allows function to modify global variables
counter = 0  # Global variable declaration

def increment():
    global counter  # Declare that we want to modify the global variable
    counter += 1    # Modify the global variable (not create a local one)

# Function call and result demonstration
increment()         # Call function to increment counter
print(counter)      # Output: 1 (global variable was modified)
```

## Lambda Functions (Anonymous Functions)

### Basic Lambda
```python
# Lambda functions: anonymous functions for simple operations
# Regular function definition
def square(x):
    return x ** 2  # Return the square of x

# Equivalent lambda function (more concise)
square = lambda x: x ** 2  # Lambda syntax: lambda parameters: expression

# Function calls (both work the same way)
print(square(5))  # Output: 25 (both functions produce same result)
```

### Lambda with Multiple Parameters
```python
# Lambda functions with multiple parameters
add = lambda x, y: x + y      # Lambda with two parameters for addition
multiply = lambda x, y: x * y # Lambda with two parameters for multiplication

# Function calls demonstrating multiple parameter lambdas
print(add(3, 4))      # Output: 7 (3 + 4)
print(multiply(3, 4)) # Output: 12 (3 * 4)
```

### Lambda with Conditional Logic
```python
# Lambda functions with conditional logic using ternary operator
is_even = lambda x: True if x % 2 == 0 else False  # Check if number is even
absolute = lambda x: x if x >= 0 else -x           # Calculate absolute value

# Function calls demonstrating conditional lambdas
print(is_even(4))   # Output: True (4 is even)
print(absolute(-5)) # Output: 5 (absolute value of -5)
```

## Built-in Functions with Lambda

### Map
```python
# Map function: applies a function to every item in an iterable
numbers = [1, 2, 3, 4, 5]                    # Input list
squares = list(map(lambda x: x**2, numbers)) # Apply square function to each number
print(squares)                               # Output: [1, 4, 9, 16, 25]
```

### Filter
```python
# Filter function: creates a new list with elements that pass a test
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]           # Input list
evens = list(filter(lambda x: x % 2 == 0, numbers))  # Keep only even numbers
print(evens)                                         # Output: [2, 4, 6, 8, 10]
```

### Reduce
```python
# Reduce function: applies a function cumulatively to items in a sequence
from functools import reduce  # Import reduce from functools module

numbers = [1, 2, 3, 4, 5]                           # Input list
sum_all = reduce(lambda x, y: x + y, numbers)       # Cumulatively add all numbers
print(sum_all)                                      # Output: 15 (1+2+3+4+5)
```

## Function Decorators

### Basic Decorator
```python
def timer(func):  # Decorator function that takes a function as parameter
    def wrapper(*args, **kwargs):  # Inner function that wraps the original function
        import time
        start = time.time()        # Record start time before function execution
        result = func(*args, **kwargs)  # Call the original function with all arguments
        end = time.time()          # Record end time after function execution
        print(f"{func.__name__} took {end - start:.4f} seconds")  # Print execution time
        return result              # Return the original function's result
    return wrapper                 # Return the wrapper function

@timer  # Decorator syntax: apply timer decorator to function
def slow_function():
    import time
    time.sleep(1)  # Simulate slow operation
    return "Done!"  # Return result

# Function call demonstrating decorator functionality
slow_function()  # Output: slow_function took 1.0000 seconds
```

### Decorator with Parameters
```python
def repeat(times):  # Decorator factory: returns a decorator function
    def decorator(func):  # Inner decorator function
        def wrapper(*args, **kwargs):  # Wrapper function that executes original function multiple times
            for _ in range(times):     # Loop 'times' number of times
                result = func(*args, **kwargs)  # Call original function
            return result              # Return result from last execution
        return wrapper                 # Return wrapper function
    return decorator                   # Return decorator function

@repeat(3)  # Apply repeat decorator with parameter 3
def greet(name):
    print(f"Hello, {name}!")  # Function to be repeated

# Function call demonstrating decorator with parameters
greet("Alice")  # Output: "Hello, Alice!" printed 3 times
```

## Recursive Functions

### Basic Recursion
```python
def factorial(n):  # Recursive function to calculate factorial
    if n <= 1:     # Base case: factorial of 0 or 1 is 1
        return 1
    return n * factorial(n - 1)  # Recursive case: n! = n * (n-1)!

# Function call demonstrating recursion
print(factorial(5))  # Output: 120 (5! = 5 * 4 * 3 * 2 * 1)
```
```

### Fibonacci Sequence
```python
def fibonacci(n):  # Recursive function to calculate Fibonacci number
    if n <= 1:     # Base case: F(0) = 0, F(1) = 1
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)  # Recursive case: F(n) = F(n-1) + F(n-2)

# Function call demonstrating Fibonacci recursion
print(fibonacci(10))  # Output: 55 (10th Fibonacci number)
```
```

## Generator Functions

### Basic Generator
```python
def count_up_to(n):  # Generator function that yields values
    i = 1            # Initialize counter
    while i <= n:    # Continue while counter is less than or equal to n
        yield i      # Yield current value (pause execution here)
        i += 1       # Increment counter

# Using the generator function
for num in count_up_to(5):  # Iterate over generated values
    print(num)              # Output: 1, 2, 3, 4, 5
```
```

### Generator Expression
```python
# Generator expression: concise way to create generators
squares = (x**2 for x in range(5))  # Generator expression for squares
print(list(squares))                # Convert generator to list: [0, 1, 4, 9, 16]
```
```

## Common Function Patterns

### Function as Parameter
```python
# Higher-order function: function that takes another function as parameter
def apply_operation(func, x, y):  # Function that accepts a function as first parameter
    return func(x, y)             # Call the passed function with x and y

def add(a, b):      # Simple addition function
    return a + b

def multiply(a, b): # Simple multiplication function
    return a * b
```

print(apply_operation(add, 3, 4))      # 7
print(apply_operation(multiply, 3, 4)) # 12
```

### Closure
```python
def outer_function(x):
    def inner_function(y):
        return x + y
    return inner_function

add_five = outer_function(5)
print(add_five(3))  # 8
```

---

[Previous Chapter](02-control.md) | [Next Chapter](04-oop.md)
