# Object-Oriented Programming (OOP)

## Class Definition

### Basic Class
```python
# Basic class definition: blueprint for creating objects
class Person:  # Class definition with class name
    def __init__(self, name, age):  # Constructor method: called when creating new instance
        self.name = name            # Instance attribute: unique to each object
        self.age = age              # Instance attribute: unique to each object
    
    def greet(self):                # Instance method: behavior of the object
        return f"Hello, my name is {self.name}"  # Use instance attribute in method

# Creating an instance (object) of the Person class
person = Person("Alice", 30)        # Instantiate with arguments for constructor
print(person.greet())               # Call instance method: "Hello, my name is Alice"
```

### Class with Methods
```python
# Class with method chaining: methods return self for fluent interface
class Calculator:  # Calculator class for mathematical operations
    def __init__(self):
        self.result = 0  # Initialize result to zero
    
    def add(self, x):    # Method to add value to result
        self.result += x # Modify instance attribute
        return self      # Return self for method chaining
    
    def subtract(self, x):  # Method to subtract value from result
        self.result -= x    # Modify instance attribute
        return self         # Return self for method chaining
    
    def get_result(self):   # Method to retrieve current result
        return self.result  # Return the current value

# Using method chaining for fluent interface
calc = Calculator()                           # Create calculator instance
result = calc.add(5).subtract(2).get_result() # Chain method calls
print(result)                                 # Output: 3
```

## Class Attributes vs Instance Attributes

### Class Attributes
```python
# Class attributes: shared by all instances of the class
class Dog:  # Dog class with both class and instance attributes
    species = "Canis familiaris"  # Class attribute: shared by all Dog instances
    
    def __init__(self, name, age):
        self.name = name  # Instance attribute: unique to each Dog object
        self.age = age    # Instance attribute: unique to each Dog object

# Creating multiple instances of the Dog class
dog1 = Dog("Buddy", 3)  # First dog instance
dog2 = Dog("Max", 5)    # Second dog instance

# Accessing class attribute (same for all instances)
print(dog1.species)  # Output: Canis familiaris
print(dog2.species)  # Output: Canis familiaris
print(Dog.species)   # Output: Canis familiaris (access via class)
```

### Instance Attributes
```python
# Instance attributes: unique to each object instance
class Car:  # Car class with instance attributes and methods
    def __init__(self, brand, model, year):
        self.brand = brand      # Instance attribute: car brand
        self.model = model      # Instance attribute: car model
        self.year = year        # Instance attribute: manufacturing year
        self.is_running = False # Instance attribute: default state (not running)
    
    def start(self):            # Method to start the car
        self.is_running = True  # Modify instance attribute
    
    def stop(self):             # Method to stop the car
        self.is_running = False # Modify instance attribute

# Creating and using a Car instance
car = Car("Toyota", "Camry", 2020)  # Create car instance
car.start()                          # Call method to start car
print(car.is_running)                # Output: True (car is now running)
```

## Inheritance

### Basic Inheritance
```python
class Animal:  # Parent/base class
    def __init__(self, name):
        self.name = name  # Common attribute for all animals
    
    def speak(self):      # Abstract method (placeholder)
        pass              # Base implementation (does nothing)

class Dog(Animal):        # Child class inherits from Animal
    def speak(self):      # Override parent method with specific implementation
        return f"{self.name} says Woof!"  # Dog-specific behavior

class Cat(Animal):        # Child class inherits from Animal
    def speak(self):      # Override parent method with specific implementation
        return f"{self.name} says Meow!"  # Cat-specific behavior

# Creating instances of child classes
dog = Dog("Buddy")        # Dog inherits __init__ from Animal
cat = Cat("Whiskers")     # Cat inherits __init__ from Animal

# Demonstrating polymorphic behavior
print(dog.speak())        # Output: Buddy says Woof!
print(cat.speak())        # Output: Whiskers says Meow!
```

### Multiple Inheritance
```python
# Multiple inheritance: class inherits from multiple parent classes
class Flyable:  # First parent class (mixin)
    def fly(self):
        return "I can fly!"  # Method from first parent

class Swimmable:  # Second parent class (mixin)
    def swim(self):
        return "I can swim!"  # Method from second parent

class Duck(Flyable, Swimmable):  # Child inherits from both parents
    def __init__(self, name):
        self.name = name  # Duck-specific attribute
    
    def speak(self):
        return f"{self.name} says Quack!"  # Duck-specific method

# Creating instance that inherits from multiple classes
duck = Duck("Donald")  # Duck has methods from both Flyable and Swimmable
print(duck.fly())      # Output: I can fly! (from Flyable)
print(duck.swim())     # Output: I can swim! (from Swimmable)
print(duck.speak())    # Output: Donald says Quack! (from Duck)
```

### Method Resolution Order (MRO)
```python
# Method Resolution Order (MRO): determines which method to call in multiple inheritance
class A:  # Base class
    def method(self):
        return "A"  # Base method implementation

class B(A):  # Inherits from A
    def method(self):
        return "B"  # Override A's method

class C(A):  # Also inherits from A
    def method(self):
        return "C"  # Override A's method

class D(B, C):  # Inherits from both B and C (B comes first)
    pass        # No method override, uses B's method

# Demonstrating MRO behavior
d = D()                    # Create instance of D
print(d.method())          # Output: B (B's method wins due to MRO)
print(D.__mro__)           # Shows method resolution order: (D, B, C, A, object)
```

## Encapsulation

### Private Attributes
```python
# Encapsulation: protecting data with private attributes and public methods
class BankAccount:  # Bank account with encapsulated balance
    def __init__(self, balance):
        self.__balance = balance  # Private attribute: cannot be accessed directly
    
    def get_balance(self):        # Public method: safe way to access balance
        return self.__balance     # Return private attribute value
    
    def deposit(self, amount):    # Public method: safe way to modify balance
        if amount > 0:            # Validation: only positive amounts allowed
            self.__balance += amount  # Modify private attribute
            return True           # Return success status
        return False              # Return failure status
    
    def withdraw(self, amount):   # Public method: safe way to modify balance
        if 0 < amount <= self.__balance:  # Validation: amount must be positive and available
            self.__balance -= amount      # Modify private attribute
            return True                   # Return success status
        return False                      # Return failure status

# Using encapsulated bank account
account = BankAccount(1000)               # Create account with initial balance
print(account.get_balance())              # Output: 1000 (safe access)
account.deposit(500)                      # Safe modification through method
print(account.get_balance())              # Output: 1500 (balance increased)
# print(account.__balance)                # AttributeError: private attribute not accessible
```

### Property Decorators
```python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        return self._radius
    
    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value
    
    @property
    def area(self):
        import math
        return math.pi * self._radius ** 2

circle = Circle(5)
print(circle.radius)  # 5
print(circle.area)    # 78.54...
circle.radius = 10
print(circle.area)    # 314.16...
```

## Polymorphism

### Method Overriding
```python
class Shape:
    def area(self):
        pass

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):
        import math
        return math.pi * self.radius ** 2

shapes = [Rectangle(4, 5), Circle(3)]
for shape in shapes:
    print(f"Area: {shape.area()}")
```

### Duck Typing
```python
class Duck:
    def swim(self):
        return "Duck swimming"
    
    def fly(self):
        return "Duck flying"

class Airplane:
    def fly(self):
        return "Airplane flying"

def make_it_fly(flying_object):
    return flying_object.fly()

duck = Duck()
airplane = Airplane()

print(make_it_fly(duck))      # Duck flying
print(make_it_fly(airplane))  # Airplane flying
```

## Special Methods (Magic Methods)

### Basic Magic Methods
```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        return f"Point({self.x}, {self.y})"
    
    def __repr__(self):
        return f"Point({self.x}, {self.y})"
    
    def __eq__(self, other):
        return self.x == other.x and self.y == other.y
    
    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)

p1 = Point(1, 2)
p2 = Point(3, 4)
print(p1)           # Point(1, 2)
print(p1 == p2)     # False
print(p1 + p2)      # Point(4, 6)
```

### Context Managers
```python
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.close()

# Using the context manager
with FileManager("test.txt", "w") as f:
    f.write("Hello, World!")
```

## Abstract Classes
```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def speak(self):
        pass
    
    @abstractmethod
    def move(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Woof!"
    
    def move(self):
        return "Running on four legs"

# animal = Animal()  # TypeError: Can't instantiate abstract class
dog = Dog()
print(dog.speak())  # Woof!
```

## Class Methods and Static Methods

### Class Methods
```python
class Date:
    def __init__(self, year, month, day):
        self.year = year
        self.month = month
        self.day = day
    
    @classmethod
    def from_string(cls, date_string):
        year, month, day = map(int, date_string.split('-'))
        return cls(year, month, day)
    
    def __str__(self):
        return f"{self.year}-{self.month:02d}-{self.day:02d}"

date = Date.from_string("2023-12-25")
print(date)  # 2023-12-25
```

### Static Methods
```python
class MathUtils:
    @staticmethod
    def add(x, y):
        return x + y
    
    @staticmethod
    def multiply(x, y):
        return x * y
    
    @staticmethod
    def is_even(n):
        return n % 2 == 0

print(MathUtils.add(5, 3))      # 8
print(MathUtils.is_even(4))     # True
```

## Metaclasses
```python
class Meta(type):
    def __new__(cls, name, bases, attrs):
        # Add a class attribute to all classes created with this metaclass
        attrs['created_by'] = 'Meta'
        return super().__new__(cls, name, bases, attrs)

class MyClass(metaclass=Meta):
    pass

print(MyClass.created_by)  # Meta
```

---

[Previous Chapter](03-functions.md) | [Next Chapter](05-libraries.md)
