# Control Structures (Conditions & Loops)

## If / Else Statements

### Basic If Statement
```python
# Basic conditional statement: execute code block only if condition is True
x = 10                    # Variable to test
if x > 0:                 # Condition: check if x is greater than 0
    print("Positive")     # Code block: executed only if condition is True
```

### If / Else
```python
# If-else statement: execute different code blocks based on condition
if x > 0:                     # Primary condition: check if x is positive
    print("Positive")         # Execute if condition is True
else:                         # Alternative path: when primary condition is False
    print("Negative or zero") # Execute if condition is False
```

### If / Elif / Else
```python
# If-elif-else statement: handle multiple conditions in sequence
if x > 0:           # First condition: check if x is positive
    print("Positive") # Execute if first condition is True
elif x == 0:        # Second condition: check if x equals zero (only if first was False)
    print("Zero")    # Execute if second condition is True
else:               # Final fallback: when all previous conditions were False
    print("Negative") # Execute if all conditions above were False
```

### Nested If Statements
```python
# Nested if statements: conditional logic within conditional blocks
if x > 0:                    # Outer condition: check if x is positive
    if x % 2 == 0:           # Inner condition: check if x is even (only if outer was True)
        print("Positive even number")  # Execute if both conditions are True
    else:                    # Inner alternative: x is odd (only if outer was True)
        print("Positive odd number")   # Execute if outer True but inner False
else:                        # Outer alternative: x is not positive
    print("Non-positive number")       # Execute if outer condition was False
```

## Loops

### For Loop
```python
# For loop: iterate over sequences and execute code for each element
# Iterating over a range of numbers
for i in range(5):           # range(5) generates sequence: 0, 1, 2, 3, 4
    print(i)                 # Print each number in sequence

# Iterating over a list of items
fruits = ["apple", "banana", "orange"]  # List to iterate over
for fruit in fruits:         # Loop variable 'fruit' takes each list element
    print(fruit)             # Print each fruit name

# Iterating with both index and value using enumerate()
for i, fruit in enumerate(fruits):  # enumerate() provides (index, value) pairs
    print(f"{i}: {fruit}")          # Print index and corresponding fruit

# Iterating over dictionary key-value pairs
person = {"name": "Alice", "age": 30}  # Dictionary to iterate over
for key, value in person.items():      # .items() returns (key, value) pairs
    print(f"{key}: {value}")           # Print each key-value pair
```

### While Loop
```python
# While loop: execute code block repeatedly while condition remains True
# Basic while loop with counter
count = 0                    # Initialize counter variable
while count < 5:             # Condition: continue while count is less than 5
    print(count)             # Execute code block: print current count
    count += 1               # Update counter: increment by 1 each iteration

# While loop with break statement for controlled exit
count = 0                    # Initialize counter variable
while True:                  # Infinite loop condition (always True)
    if count >= 5:           # Check if we should exit the loop
        break                # Break statement: immediately exit the loop
    print(count)             # Execute code block: print current count
    count += 1               # Update counter: increment by 1 each iteration
```

### Loop Control Statements

#### Break
```python
# Break statement: immediately exit the current loop when encountered
for i in range(10):          # Loop through numbers 0 to 9
    if i == 5:               # Check if we've reached the target number
        break                # Break statement: exit loop immediately when i equals 5
    print(i)                 # Print numbers 0, 1, 2, 3, 4 (loop exits before printing 5)
```

#### Continue
```python
# Continue statement: skip current iteration and continue with next iteration
for i in range(10):          # Loop through numbers 0 to 9
    if i % 2 == 0:           # Check if current number is even (divisible by 2)
        continue             # Continue statement: skip this iteration for even numbers
    print(i)                 # Print only odd numbers: 1, 3, 5, 7, 9
```

#### Pass
```python
for i in range(10):
    if i < 5:
        pass  # Do nothing, placeholder
    else:
        print(i)
```

## List Comprehensions
```python
# Basic list comprehension
squares = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# Nested list comprehension
matrix = [[i+j for j in range(3)] for i in range(3)]
```

## Conditional Expressions (Ternary Operator)
```python
# Traditional if/else
if x > 0:
    result = "positive"
else:
    result = "non-positive"

# Ternary operator
result = "positive" if x > 0 else "non-positive"
```

## Match Statement (Python 3.10+)
```python
def analyze_number(x):
    match x:
        case 0:
            return "Zero"
        case 1 | 2 | 3:
            return "Small positive"
        case _ if x < 0:
            return "Negative"
        case _:
            return "Large positive"
```

## Error Handling with Try/Except
```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    print(f"An error occurred: {e}")
else:
    print("No errors occurred")
finally:
    print("This always executes")
```

## Common Patterns

### Checking Multiple Conditions
```python
# Using 'and'
if age >= 18 and has_id:
    print("Can enter")

# Using 'or'
if is_student or is_teacher:
    print("Educational discount")

# Using 'in'
if fruit in ["apple", "banana", "orange"]:
    print("Valid fruit")
```

### Loop with Counter
```python
# Using enumerate
for index, item in enumerate(items):
    print(f"Item {index}: {item}")

# Manual counter
counter = 0
for item in items:
    print(f"Item {counter}: {item}")
    counter += 1
```

---

[Previous Chapter](01-basics.md) | [Next Chapter](03-functions.md)
