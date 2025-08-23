#!/usr/bin/env python3
"""
Script to convert all Markdown files to HTML pages for the Python Cheat Sheet website.
Updated for new organized directory structure.
"""

import os
import re
from pathlib import Path

def read_template():
    """Read the HTML template file."""
    template_path = Path(__file__).parent.parent / 'templates' / 'template.html'
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()

def convert_markdown_to_html(markdown_content):
    """Convert Markdown content to HTML."""
    # Basic Markdown to HTML conversion
    html = markdown_content
    
    # Headers
    html = re.sub(r'^# (.+)$', r'<h1 class="section-title"><i class="fas fa-play-circle me-2"></i>\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2 class="text-warning mt-4"><i class="fas fa-star me-2"></i>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.+)$', r'<h3 class="text-primary mt-3">\1</h3>', html, flags=re.MULTILINE)
    
    # Code blocks
    html = re.sub(r'```python\n(.*?)\n```', r'<div class="code-container">\n<button class="copy-btn" onclick="copyCode(this)">\n<i class="fas fa-copy"></i> Copy\n</button>\n<pre class="line-numbers"><code class="language-python">\1</code></pre>\n</div>', html, flags=re.DOTALL)
    
    # Inline code
    html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)
    
    # Bold text
    html = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', html)
    
    # Lists
    html = re.sub(r'^- (.+)$', r'<li><i class="fas fa-check text-success me-2"></i>\1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'^(\d+)\. (.+)$', r'<li>\2</li>', html, flags=re.MULTILINE)
    
    # Links
    html = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2" target="_blank" class="text-warning">\1</a>', html)
    
    # Paragraphs
    html = re.sub(r'\n\n([^<].+?)\n\n', r'<p>\1</p>', html, flags=re.DOTALL)
    
    return html

def create_html_page(markdown_file, template, all_files):
    """Create an HTML page from a Markdown file."""
    # Read Markdown content
    with open(markdown_file, 'r', encoding='utf-8') as f:
        markdown_content = f.read()
    
    # Extract title from first line
    title_match = re.search(r'^# (.+)$', markdown_content, re.MULTILINE)
    title = title_match.group(1) if title_match else "Python Cheat Sheet"
    
    # Convert Markdown to HTML
    html_content = convert_markdown_to_html(markdown_content)
    
    # Create card structure
    html_content = f'''
                    <div class="card">
                        <div class="card-header">
                            <i class="fas fa-book me-2"></i>
                            {title}
                        </div>
                        <div class="card-body">
                            {html_content}
                        </div>
                    </div>
'''
    
    # Replace template placeholders
    html_page = template.replace('PAGE_TITLE', title)
    html_page = html_page.replace('CONTENT_PLACEHOLDER', html_content)
    
    # Set navigation links
    base_name = Path(markdown_file).stem
    current_index = -1
    
    # Find current file index
    for i, file in enumerate(all_files):
        if Path(file).stem == base_name:
            current_index = i
            break
    
    if current_index >= 0:
        # Set previous page
        if current_index == 0:
            html_page = html_page.replace('PREVIOUS_PAGE', '#')
        else:
            prev_file = Path(all_files[current_index - 1]).stem
            html_page = html_page.replace('PREVIOUS_PAGE', f'{prev_file}.html')
        
        # Set next page
        if current_index == len(all_files) - 1:
            html_page = html_page.replace('NEXT_PAGE', '#')
        else:
            next_file = Path(all_files[current_index + 1]).stem
            html_page = html_page.replace('NEXT_PAGE', f'{next_file}.html')
    
    return html_page

def find_markdown_files(content_dir):
    """Recursively find all Markdown files in the content directory."""
    markdown_files = []
    for root, dirs, files in os.walk(content_dir):
        for file in files:
            if file.endswith('.md') and file not in ['README.md', 'SUMMARY.md']:
                markdown_files.append(Path(root) / file)
    return sorted(markdown_files)

def main():
    """Main function to create all HTML pages."""
    print("🐍 Creating HTML pages for Python Cheat Sheet...")
    
    # Get the project root directory (two levels up from this script)
    project_root = Path(__file__).parent.parent.parent
    pages_dir = project_root / 'src' / 'pages'
    content_dir = project_root / 'content'
    
    # Read template
    template = read_template()
    
    # Find all Markdown files in the content directory
    markdown_files = find_markdown_files(content_dir)
    
    created_pages = []
    
    for md_file in markdown_files:
        print(f"📄 Converting {md_file.name}...")
        
        # Create HTML filename
        html_file = pages_dir / f"{md_file.stem}.html"
        
        # Create HTML content
        html_content = create_html_page(md_file, template, markdown_files)
        
        # Write HTML file
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        created_pages.append(html_file.name)
        print(f"✅ Created {html_file.name}")
    
    print(f"\n🎉 Successfully created {len(created_pages)} HTML pages!")
    print("📁 Files created:")
    for page in created_pages:
        print(f"   - {page}")
    
    print("\n🚀 You can now open any HTML file in your browser or use the server:")
    print("   python -m http.server 8000")
    print("   Then visit: http://localhost:8000")

if __name__ == "__main__":
    main()
