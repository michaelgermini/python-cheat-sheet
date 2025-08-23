# Data Science & ML Mini-Cheat Sheets (Pandas, NumPy, Matplotlib, Scikit-learn)

## Advanced Pandas Operations

### Data Manipulation and Transformation
```python
import pandas as pd  # Import pandas for data manipulation and analysis
import numpy as np   # Import numpy for numerical operations

# Create sample data: demonstration DataFrame with various data types
df = pd.DataFrame({
    'category': ['A', 'B', 'A', 'C', 'B', 'A'],  # Categorical data for grouping
    'value': [10, 20, 15, 25, 30, 12],           # Numerical values for aggregation
    'date': pd.date_range('2023-01-01', periods=6),  # Date range for time-based analysis
    'score': [0.8, 0.6, 0.9, 0.7, 0.5, 0.8]     # Float values for statistical analysis
})

# Advanced groupby operations: demonstrate powerful data aggregation capabilities
def advanced_groupby_examples():
    """Advanced groupby operations with multiple aggregations and custom functions."""
    
    # Multiple aggregations: apply different functions to different columns
    grouped = df.groupby('category').agg({
        'value': ['mean', 'std', 'count'],  # Multiple statistics for value column
        'score': ['min', 'max', 'median']   # Multiple statistics for score column
    })
    print("Multiple aggregations:")
    print(grouped)
    
    # Custom aggregation functions: define your own aggregation logic
    def custom_agg(x):
        return {
            'range': x.max() - x.min(),                    # Calculate range (max - min)
            'iqr': x.quantile(0.75) - x.quantile(0.25)    # Calculate interquartile range
        }
    
    custom_grouped = df.groupby('category')['value'].apply(custom_agg)  # Apply custom function
    print("\nCustom aggregations:")
    print(custom_grouped)
    
    # Groupby with multiple columns: aggregate across multiple grouping variables
    multi_grouped = df.groupby(['category']).agg({
        'value': 'sum',   # Sum of values for each category
        'score': 'mean'   # Mean of scores for each category
    }).round(2)  # Round results to 2 decimal places for readability
    print("\nMulti-column groupby:")
    print(multi_grouped)

# Usage: demonstrate advanced groupby functionality
advanced_groupby_examples()  # Execute the groupby examples
```

### Pivot Tables and Cross-tabulation
```python
def pivot_operations():
    """Advanced pivot table operations for data reshaping and analysis."""
    
    # Create sample data for pivoting: sales data with multiple dimensions
    sales_data = pd.DataFrame({
        'date': pd.date_range('2023-01-01', periods=20),  # Date dimension for time analysis
        'product': ['A', 'B', 'A', 'C', 'B'] * 4,        # Product dimension for product analysis
        'region': ['North', 'South', 'East', 'West'] * 5, # Region dimension for geographic analysis
        'sales': np.random.randint(100, 1000, 20),       # Sales values for aggregation
        'quantity': np.random.randint(10, 100, 20)       # Quantity values for aggregation
    })
    
    # Basic pivot table: reshape data with region as rows and product as columns
    pivot_sales = sales_data.pivot_table(
        index='region',      # Rows: geographic regions
        columns='product',   # Columns: product types
        values='sales',      # Values to aggregate: sales amounts
        aggfunc='sum',       # Aggregation function: sum sales by region/product
        fill_value=0         # Fill missing values with 0
    )
    print("Sales pivot table:")
    print(pivot_sales)
    
    # Pivot table with multiple values: aggregate multiple columns simultaneously
    pivot_multi = sales_data.pivot_table(
        index='region',      # Rows: geographic regions
        columns='product',   # Columns: product types
        values=['sales', 'quantity'],  # Multiple value columns to aggregate
        aggfunc={'sales': 'sum', 'quantity': 'mean'},  # Different functions for different values
        fill_value=0         # Fill missing values with 0
    )
    print("\nMulti-value pivot table:")
    print(pivot_multi)
    
    # Cross-tabulation: frequency analysis with normalization
    crosstab_result = pd.crosstab(
        sales_data['region'],    # Row variable: geographic regions
        sales_data['product'],   # Column variable: product types
        values=sales_data['sales'],  # Values to aggregate: sales amounts
        aggfunc='sum',          # Aggregation function: sum sales
        normalize='index'       # Normalize by row (percentage within each region)
    )
    print("\nCross-tabulation (normalized):")
    print(crosstab_result)

# Usage: demonstrate pivot table operations
pivot_operations()  # Execute pivot table examples
```

### Advanced Merging and Joining
```python
def advanced_merging():
    """Advanced merging and joining operations for combining multiple datasets."""
    
    # Create sample dataframes: employee data with different schemas
    df1 = pd.DataFrame({
        'id': [1, 2, 3, 4],                    # Employee IDs (primary key)
        'name': ['Alice', 'Bob', 'Charlie', 'David'],  # Employee names
        'dept': ['HR', 'IT', 'HR', 'IT']       # Department assignments
    })
    
    df2 = pd.DataFrame({
        'id': [1, 2, 3, 5],                    # Employee IDs (some overlap with df1)
        'salary': [50000, 60000, 55000, 70000], # Salary information
        'bonus': [5000, 6000, 5500, 7000]      # Bonus information
    })
    
    df3 = pd.DataFrame({
        'dept': ['HR', 'IT', 'Finance'],       # Department names
        'manager': ['John', 'Jane', 'Mike']    # Department managers
    })
    
    # Inner join: only keep rows that exist in both dataframes
    inner_merged = df1.merge(df2, on='id', how='inner')  # Join on employee ID
    print("Inner join:")
    print(inner_merged)
    
    # Left join: keep all rows from left dataframe (df1)
    left_merged = df1.merge(df2, on='id', how='left')  # Keep all employees from df1
    print("\nLeft join:")
    print(left_merged)
    
    # Multiple joins: chain multiple merge operations
    final_df = df1.merge(df2, on='id', how='left').merge(df3, on='dept', how='left')  # Join employee data with department info
    print("\nMultiple joins:")
    print(final_df)
    
    # Merge with different column names: handle schema mismatches
    df2_renamed = df2.rename(columns={'id': 'employee_id'})  # Rename column to match different naming convention
    merged_diff_cols = df1.merge(df2_renamed, left_on='id', right_on='employee_id')  # Specify different column names
    print("\nMerge with different column names:")
    print(merged_diff_cols)

# Usage: demonstrate advanced merging operations
advanced_merging()  # Execute merging examples
```

### Multi-index Operations
```python
def multi_index_operations():
    """Working with multi-index DataFrames for hierarchical data analysis."""
    
    # Create multi-index DataFrame: hierarchical structure with date and category levels
    dates = pd.date_range('2023-01-01', periods=6)  # Date range for time dimension
    categories = ['A', 'B']  # Category dimension for grouping
    
    index = pd.MultiIndex.from_product([dates, categories], names=['date', 'category'])  # Create hierarchical index
    
    multi_df = pd.DataFrame({
        'value': np.random.randn(12),  # Random values for demonstration
        'count': np.random.randint(1, 100, 12)  # Random counts for demonstration
    }, index=index)  # Use hierarchical index for DataFrame
    
    print("Multi-index DataFrame:")
    print(multi_df)
    
    # Selecting data with multi-index: access specific levels of hierarchy
    print("\nSelecting specific date:")
    print(multi_df.loc['2023-01-01'])  # Select all data for specific date
    
    print("\nSelecting specific category:")
    print(multi_df.xs('A', level='category'))  # Cross-section: select all data for category 'A'
    
    # Groupby with multi-index: aggregate across hierarchical levels
    grouped_multi = multi_df.groupby(level='category').agg({
        'value': ['mean', 'std'],  # Multiple statistics for value column
        'count': 'sum'             # Sum for count column
    })
    print("\nGroupby with multi-index:")
    print(grouped_multi)
    
    # Unstacking multi-index: convert hierarchical index to columns
    unstacked = multi_df.unstack('category')  # Move category level to columns
    print("\nUnstacked DataFrame:")
    print(unstacked)
    
    # Stacking back: convert columns back to hierarchical index
    restacked = unstacked.stack('category')  # Move category columns back to index
    print("\nRestacked DataFrame:")
    print(restacked)

# Usage: demonstrate multi-index operations
multi_index_operations()  # Execute multi-index examples
```

## Advanced NumPy Operations

### Broadcasting and Vectorization
```python
def numpy_broadcasting():
    """Advanced NumPy broadcasting examples for efficient array operations."""
    
    # Create arrays: demonstrate different shapes for broadcasting
    a = np.array([[1, 2, 3], [4, 5, 6]])  # 2D array (2x3)
    b = np.array([10, 20, 30])            # 1D array (3,)
    c = np.array([[1], [2]])              # 2D array (2x1)
    
    print("Array a:")
    print(a)
    print("Array b:")
    print(b)
    print("Array c:")
    print(c)
    
    # Broadcasting examples: automatic shape alignment for element-wise operations
    print("\nBroadcasting a + b:")
    print(a + b)  # b is broadcasted to match a's shape (2x3)
    
    print("\nBroadcasting a + c:")
    print(a + c)  # c is broadcasted to match a's shape (2x3)
    
    # Advanced broadcasting: demonstrate broadcasting with higher dimensional arrays
    arr_3d = np.random.randn(3, 4, 5)  # 3D array (3x4x5)
    arr_2d = np.random.randn(4, 5)     # 2D array (4x5)
    arr_1d = np.random.randn(5)        # 1D array (5,)
    
    print(f"\n3D array shape: {arr_3d.shape}")
    print(f"2D array shape: {arr_2d.shape}")
    print(f"1D array shape: {arr_1d.shape}")
    
    # Broadcasting with different dimensions: automatic shape expansion
    result_3d_2d = arr_3d + arr_2d  # 2D array broadcasted to 3D
    result_3d_1d = arr_3d + arr_1d  # 1D array broadcasted to 3D
    
    print(f"Result of 3D + 2D shape: {result_3d_2d.shape}")
    print(f"Result of 3D + 1D shape: {result_3d_1d.shape}")

# Usage: demonstrate NumPy broadcasting
numpy_broadcasting()  # Execute broadcasting examples
```

### Fancy Indexing and Boolean Masks
```python
def numpy_indexing():
    """Advanced NumPy indexing techniques."""
    
    # Create sample array
    arr = np.random.randn(10, 10)
    print("Original array:")
    print(arr)
    
    # Boolean indexing
    mask = arr > 0.5
    positive_values = arr[mask]
    print(f"\nValues > 0.5: {positive_values}")
    
    # Fancy indexing with integer arrays
    indices = np.array([0, 2, 4, 6, 8])
    selected_rows = arr[indices]
    print(f"\nSelected rows {indices}:")
    print(selected_rows)
    
    # Advanced boolean operations
    mask1 = arr > 0.5
    mask2 = arr < 1.0
    combined_mask = mask1 & mask2
    filtered_values = arr[combined_mask]
    print(f"\nValues between 0.5 and 1.0: {filtered_values}")
    
    # Indexing with multiple conditions
    row_indices = np.array([1, 3, 5])
    col_indices = np.array([2, 4, 6])
    selected_elements = arr[row_indices, col_indices]
    print(f"\nSelected elements at positions (1,2), (3,4), (5,6):")
    print(selected_elements)

# Usage
numpy_indexing()
```

### Advanced Array Operations
```python
def numpy_advanced_ops():
    """Advanced NumPy array operations."""
    
    # Create sample arrays
    arr1 = np.random.randn(5, 5)
    arr2 = np.random.randn(5, 5)
    
    print("Array 1:")
    print(arr1)
    print("\nArray 2:")
    print(arr2)
    
    # Element-wise operations
    element_wise_sum = np.add(arr1, arr2)
    element_wise_prod = np.multiply(arr1, arr2)
    
    print("\nElement-wise sum:")
    print(element_wise_sum)
    print("\nElement-wise product:")
    print(element_wise_prod)
    
    # Matrix operations
    matrix_prod = np.dot(arr1, arr2)
    print("\nMatrix product:")
    print(matrix_prod)
    
    # Statistical operations
    print(f"\nArray 1 statistics:")
    print(f"Mean: {np.mean(arr1):.4f}")
    print(f"Std: {np.std(arr1):.4f}")
    print(f"Min: {np.min(arr1):.4f}")
    print(f"Max: {np.max(arr1):.4f}")
    print(f"Median: {np.median(arr1):.4f}")
    
    # Axis-wise operations
    row_means = np.mean(arr1, axis=1)
    col_means = np.mean(arr1, axis=0)
    
    print(f"\nRow means: {row_means}")
    print(f"Column means: {col_means}")

# Usage
numpy_advanced_ops()
```

## Advanced Matplotlib and Seaborn

### Custom Plotting Styles
```python
import matplotlib.pyplot as plt
import seaborn as sns

def advanced_plotting():
    """Advanced plotting with custom styles."""
    
    # Set style
    plt.style.use('seaborn-v0_8')
    sns.set_palette("husl")
    
    # Create sample data
    x = np.linspace(0, 10, 100)
    y1 = np.sin(x)
    y2 = np.cos(x)
    y3 = np.sin(x + np.pi/4)
    
    # Create subplots with custom layout
    fig, axes = plt.subplots(2, 2, figsize=(12, 8))
    fig.suptitle('Advanced Plotting Examples', fontsize=16, fontweight='bold')
    
    # Plot 1: Multiple lines with custom styling
    axes[0, 0].plot(x, y1, label='sin(x)', linewidth=2, color='blue', alpha=0.7)
    axes[0, 0].plot(x, y2, label='cos(x)', linewidth=2, color='red', alpha=0.7)
    axes[0, 0].plot(x, y3, label='sin(x+π/4)', linewidth=2, color='green', alpha=0.7)
    axes[0, 0].set_title('Trigonometric Functions')
    axes[0, 0].set_xlabel('x')
    axes[0, 0].set_ylabel('y')
    axes[0, 0].legend()
    axes[0, 0].grid(True, alpha=0.3)
    
    # Plot 2: Scatter plot with color mapping
    scatter_x = np.random.randn(100)
    scatter_y = np.random.randn(100)
    colors = np.random.rand(100)
    
    scatter = axes[0, 1].scatter(scatter_x, scatter_y, c=colors, cmap='viridis', 
                                alpha=0.6, s=50)
    axes[0, 1].set_title('Scatter Plot with Color Mapping')
    axes[0, 1].set_xlabel('X')
    axes[0, 1].set_ylabel('Y')
    plt.colorbar(scatter, ax=axes[0, 1])
    
    # Plot 3: Histogram with multiple datasets
    data1 = np.random.normal(0, 1, 1000)
    data2 = np.random.normal(2, 1.5, 1000)
    
    axes[1, 0].hist(data1, bins=30, alpha=0.7, label='Dataset 1', color='blue')
    axes[1, 0].hist(data2, bins=30, alpha=0.7, label='Dataset 2', color='red')
    axes[1, 0].set_title('Histogram Comparison')
    axes[1, 0].set_xlabel('Value')
    axes[1, 0].set_ylabel('Frequency')
    axes[1, 0].legend()
    
    # Plot 4: Box plot
    box_data = [np.random.normal(0, 1, 100),
                np.random.normal(1, 1.2, 100),
                np.random.normal(2, 0.8, 100)]
    
    axes[1, 1].boxplot(box_data, labels=['Group A', 'Group B', 'Group C'])
    axes[1, 1].set_title('Box Plot Comparison')
    axes[1, 1].set_ylabel('Value')
    
    plt.tight_layout()
    plt.show()

# Usage
# advanced_plotting()
```

### Seaborn Advanced Visualizations
```python
def seaborn_advanced():
    """Advanced Seaborn visualizations."""
    
    # Create sample data
    np.random.seed(42)
    n_samples = 1000
    
    data = pd.DataFrame({
        'x': np.random.normal(0, 1, n_samples),
        'y': np.random.normal(0, 1, n_samples),
        'category': np.random.choice(['A', 'B', 'C'], n_samples),
        'value': np.random.exponential(1, n_samples),
        'group': np.random.choice(['Group1', 'Group2'], n_samples)
    })
    
    # Create figure with multiple subplots
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle('Advanced Seaborn Visualizations', fontsize=16, fontweight='bold')
    
    # Plot 1: Joint plot (scatter + histograms)
    sns.jointplot(data=data, x='x', y='y', hue='category', 
                  kind='scatter', alpha=0.6, ax=axes[0, 0])
    axes[0, 0].set_title('Joint Distribution')
    
    # Plot 2: Violin plot
    sns.violinplot(data=data, x='category', y='value', hue='group', ax=axes[0, 1])
    axes[0, 1].set_title('Violin Plot by Category and Group')
    
    # Plot 3: Heatmap
    correlation_matrix = data[['x', 'y', 'value']].corr()
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0, 
                square=True, ax=axes[1, 0])
    axes[1, 0].set_title('Correlation Heatmap')
    
    # Plot 4: Faceted histogram
    sns.histplot(data=data, x='value', hue='category', multiple='stack', 
                 bins=30, ax=axes[1, 1])
    axes[1, 1].set_title('Stacked Histogram by Category')
    
    plt.tight_layout()
    plt.show()

# Usage
# seaborn_advanced()
```

## Scikit-learn Machine Learning

### Data Preprocessing Pipeline
```python
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

def ml_preprocessing_pipeline():
    """Complete ML preprocessing pipeline."""
    
    # Create sample dataset
    np.random.seed(42)
    n_samples = 1000
    
    data = pd.DataFrame({
        'age': np.random.normal(35, 10, n_samples),
        'income': np.random.normal(50000, 20000, n_samples),
        'education': np.random.choice(['High School', 'Bachelor', 'Master', 'PhD'], n_samples),
        'city': np.random.choice(['NYC', 'LA', 'Chicago', 'Houston'], n_samples),
        'target': np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
    })
    
    # Add some missing values
    data.loc[np.random.choice(data.index, 50), 'age'] = np.nan
    data.loc[np.random.choice(data.index, 30), 'income'] = np.nan
    
    print("Original data shape:", data.shape)
    print("Missing values:")
    print(data.isnull().sum())
    
    # Separate features and target
    X = data.drop('target', axis=1)
    y = data['target']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Define preprocessing steps
    numeric_features = ['age', 'income']
    categorical_features = ['education', 'city']
    
    # Numeric preprocessing
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    # Categorical preprocessing
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(drop='first', sparse=False))
    ])
    
    # Combine transformers
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ]
    )
    
    # Create full pipeline
    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    # Fit and predict
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    # Evaluate
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    return model, X_test, y_test

# Usage
# model, X_test, y_test = ml_preprocessing_pipeline()
```

### Feature Engineering and Selection
```python
from sklearn.feature_selection import SelectKBest, f_classif, RFE
from sklearn.linear_model import LogisticRegression
from sklearn.decomposition import PCA

def feature_engineering():
    """Feature engineering and selection techniques."""
    
    # Create sample data
    np.random.seed(42)
    X = np.random.randn(1000, 20)
    y = np.random.choice([0, 1], 1000, p=[0.7, 0.3])
    
    # Add some informative features
    X[:, 0] = y + np.random.normal(0, 0.1, 1000)  # Feature 0 is informative
    X[:, 1] = y * 2 + np.random.normal(0, 0.1, 1000)  # Feature 1 is informative
    
    print("Original data shape:", X.shape)
    
    # 1. Statistical feature selection
    selector_kbest = SelectKBest(score_func=f_classif, k=10)
    X_selected_kbest = selector_kbest.fit_transform(X, y)
    
    print(f"\nAfter SelectKBest: {X_selected_kbest.shape}")
    print("Selected feature indices:", selector_kbest.get_support())
    
    # 2. Recursive Feature Elimination
    estimator = LogisticRegression(random_state=42)
    selector_rfe = RFE(estimator=estimator, n_features_to_select=10)
    X_selected_rfe = selector_rfe.fit_transform(X, y)
    
    print(f"\nAfter RFE: {X_selected_rfe.shape}")
    print("Selected feature indices:", selector_rfe.get_support())
    
    # 3. Principal Component Analysis
    pca = PCA(n_components=0.95)  # Keep 95% of variance
    X_pca = pca.fit_transform(X)
    
    print(f"\nAfter PCA: {X_pca.shape}")
    print(f"Explained variance ratio: {pca.explained_variance_ratio_}")
    print(f"Total explained variance: {sum(pca.explained_variance_ratio_):.3f}")
    
    return X_selected_kbest, X_selected_rfe, X_pca

# Usage
# X_kbest, X_rfe, X_pca = feature_engineering()
```

### Model Evaluation and Cross-Validation
```python
from sklearn.model_selection import cross_val_score, GridSearchCV, StratifiedKFold
from sklearn.metrics import roc_auc_score, roc_curve, precision_recall_curve
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier

def model_evaluation():
    """Comprehensive model evaluation."""
    
    # Create sample data
    np.random.seed(42)
    X = np.random.randn(1000, 10)
    y = np.random.choice([0, 1], 1000, p=[0.7, 0.3])
    
    # Define models
    models = {
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
    }
    
    # Cross-validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    for name, model in models.items():
        print(f"\n{name}:")
        
        # Cross-validation scores
        cv_scores = cross_val_score(model, X, y, cv=cv, scoring='accuracy')
        print(f"CV Accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")
        
        # ROC-AUC
        cv_auc = cross_val_score(model, X, y, cv=cv, scoring='roc_auc')
        print(f"CV ROC-AUC: {cv_auc.mean():.3f} (+/- {cv_auc.std() * 2:.3f})")
    
    # Hyperparameter tuning
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [3, 5, 7, None],
        'min_samples_split': [2, 5, 10]
    }
    
    rf = RandomForestClassifier(random_state=42)
    grid_search = GridSearchCV(rf, param_grid, cv=cv, scoring='roc_auc', n_jobs=-1)
    grid_search.fit(X, y)
    
    print(f"\nBest parameters: {grid_search.best_params_}")
    print(f"Best CV score: {grid_search.best_score_:.3f}")
    
    return grid_search.best_estimator_

# Usage
# best_model = model_evaluation()
```

### Advanced Visualization for ML
```python
def ml_visualizations():
    """Advanced visualizations for machine learning."""
    
    # Create sample data
    np.random.seed(42)
    X = np.random.randn(1000, 2)
    y = np.random.choice([0, 1], 1000, p=[0.7, 0.3])
    
    # Train a model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Create figure
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    fig.suptitle('Machine Learning Visualizations', fontsize=16, fontweight='bold')
    
    # Plot 1: Feature importance
    feature_importance = model.feature_importances_
    axes[0, 0].bar(range(len(feature_importance)), feature_importance)
    axes[0, 0].set_title('Feature Importance')
    axes[0, 0].set_xlabel('Feature Index')
    axes[0, 0].set_ylabel('Importance')
    
    # Plot 2: ROC Curve
    y_pred_proba = model.predict_proba(X)[:, 1]
    fpr, tpr, _ = roc_curve(y, y_pred_proba)
    auc_score = roc_auc_score(y, y_pred_proba)
    
    axes[0, 1].plot(fpr, tpr, label=f'ROC Curve (AUC = {auc_score:.3f})')
    axes[0, 1].plot([0, 1], [0, 1], 'k--', label='Random')
    axes[0, 1].set_title('ROC Curve')
    axes[0, 1].set_xlabel('False Positive Rate')
    axes[0, 1].set_ylabel('True Positive Rate')
    axes[0, 1].legend()
    
    # Plot 3: Precision-Recall Curve
    precision, recall, _ = precision_recall_curve(y, y_pred_proba)
    axes[1, 0].plot(recall, precision)
    axes[1, 0].set_title('Precision-Recall Curve')
    axes[1, 0].set_xlabel('Recall')
    axes[1, 0].set_ylabel('Precision')
    
    # Plot 4: Decision boundary
    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, 0.1),
                         np.arange(y_min, y_max, 0.1))
    
    Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)
    
    axes[1, 1].contourf(xx, yy, Z, alpha=0.4)
    scatter = axes[1, 1].scatter(X[:, 0], X[:, 1], c=y, alpha=0.8)
    axes[1, 1].set_title('Decision Boundary')
    axes[1, 1].set_xlabel('Feature 1')
    axes[1, 1].set_ylabel('Feature 2')
    
    plt.tight_layout()
    plt.show()

# Usage
# ml_visualizations()
```

---

[Previous Chapter](13-concurrency.md) | [Next Chapter](15-deployment.md)
