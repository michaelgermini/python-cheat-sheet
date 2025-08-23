# Variables & Data Types

## Variables
```python
# Variable assignment examples with different data types
x = 10        # Integer: whole number without decimal point
name = "Alice" # String: sequence of characters enclosed in quotes
pi = 3.14     # Float: decimal number with fractional part
is_valid = True  # Boolean: logical value (True/False)
my_list = [1, 2, 3]  # List: ordered, mutable collection of items
my_dict = {"key": "value"}  # Dictionary: key-value pair collection
```

## Basic Data Types

### Numbers
```python
# Integer data type: whole numbers (positive, negative, or zero)
age = 25      # Positive integer representing age
count = -10   # Negative integer representing count

# Float data type: decimal numbers with fractional parts
price = 19.99 # Decimal number representing price
pi = 3.14159  # Mathematical constant with decimal precision

# Complex numbers: numbers with real and imaginary parts
complex_num = 3 + 4j  # Complex number where 3 is real part, 4j is imaginary
```

### Strings
```python
# String literals: can use single or double quotes (both are equivalent)
name = "John"         # String with double quotes
message = 'Hello, World!'  # String with single quotes

# Multi-line strings: use triple quotes for strings spanning multiple lines
text = """
This is a
multi-line string
"""

# String concatenation and operations
first = "Hello"
second = "World"
result = first + " " + second  # Concatenation: combines strings with space separator
length = len(result)  # Built-in len() function returns the number of characters
```

### Booleans
```python
# Boolean values: represent logical states (True or False)
is_active = True    # Boolean True value
is_finished = False # Boolean False value

# Boolean operations: logical operators for combining boolean values
result = True and False  # Logical AND: returns True only if both operands are True
result = True or False   # Logical OR: returns True if at least one operand is True
result = not True        # Logical NOT: inverts the boolean value (True becomes False)
```

### Lists
```python
# Lists: ordered, mutable collections that can store multiple items of any type
fruits = ["apple", "banana", "orange"]  # List of strings
numbers = [1, 2, 3, 4, 5]              # List of integers

# Accessing list elements: use index (0-based) to retrieve specific items
first_fruit = fruits[0]   # Index 0: get first element ("apple")
last_number = numbers[-1] # Index -1: get last element (5)

# Modifying lists: lists are mutable, so you can change their contents
fruits.append("grape")    # Add new item to the end of the list
fruits[1] = "pear"       # Replace item at index 1 with new value
```

### Dictionaries
```python
# Dictionaries: unordered collections of key-value pairs (hash tables)
person = {
    "name": "Alice",    # Key "name" maps to value "Alice"
    "age": 30,          # Key "age" maps to value 30
    "city": "New York"  # Key "city" maps to value "New York"
}

# Accessing dictionary values: two methods for retrieving values by key
name = person["name"]           # Direct access: raises KeyError if key doesn't exist
age = person.get("age", 0)      # Safe access: returns default value (0) if key missing

# Modifying dictionaries: add new key-value pairs or update existing ones
person["email"] = "alice@example.com"  # Add new key "email" with corresponding value
```

## Operators

### Arithmetic Operators
```python
# Arithmetic operators: perform mathematical operations on numeric values
x = 10  # First operand
y = 3   # Second operand

x + y    # Addition: combines two numbers (10 + 3 = 13)
x - y    # Subtraction: subtracts second number from first (10 - 3 = 7)
x * y    # Multiplication: multiplies two numbers (10 * 3 = 30)
x / y    # Division: divides first number by second (10 / 3 = 3.333...)
x // y   # Floor division: integer division, rounds down (10 // 3 = 3)
x % y    # Modulo: remainder after division (10 % 3 = 1)
x ** y   # Exponentiation: raises first number to power of second (10 ** 3 = 1000)
```

### Comparison Operators
```python
# Comparison operators: compare values and return boolean results
x = 5   # First value to compare
y = 10  # Second value to compare

x == y   # Equal to: checks if values are identical (5 == 10 is False)
x != y   # Not equal to: checks if values are different (5 != 10 is True)
x < y    # Less than: checks if first value is smaller (5 < 10 is True)
x > y    # Greater than: checks if first value is larger (5 > 10 is False)
x <= y   # Less than or equal: checks if first value is smaller or equal (5 <= 10 is True)
x >= y   # Greater than or equal: checks if first value is larger or equal (5 >= 10 is False)
```

### Logical Operators
```python
# Logical operators: combine boolean values using logical operations
a = True   # First boolean value
b = False  # Second boolean value

a and b  # Logical AND: returns True only if both operands are True (True and False = False)
a or b   # Logical OR: returns True if at least one operand is True (True or False = True)
not a    # Logical NOT: inverts the boolean value (not True = False)
```

## Type Conversion
```python
# Type conversion: converting values from one data type to another
x = "123"           # String containing numeric characters
y = int(x)          # Convert string to integer (123)
z = float(x)        # Convert string to float (123.0)
text = str(y)       # Convert integer back to string ("123")

# Type checking: determine the data type of a value
type(x)             # Built-in function returns the type object (<class 'str'>)
isinstance(x, str)  # Built-in function checks if object is instance of specified type (True)
```

## String Formatting
```python
# String formatting: different ways to embed variables and expressions in strings
name = "Alice"  # Variable to embed in string
age = 30        # Numeric variable to embed in string

# f-strings (Python 3.6+): most readable and recommended method
message = f"My name is {name} and I am {age} years old"  # Variables embedded directly in curly braces

# .format() method: older but still widely used method
message = "My name is {} and I am {} years old".format(name, age)  # Placeholders replaced by format arguments

# % operator (old style): legacy formatting, similar to C printf
message = "My name is %s and I am %d years old" % (name, age)  # %s for string, %d for integer
```

---

[Previous Chapter](00-intro.md) | [Next Chapter](02-control.md)
