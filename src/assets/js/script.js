// Copy code functionality
function copyCode(button) {
    const codeBlock = button.nextElementSibling.querySelector('code');
    const textArea = document.createElement('textarea');
    textArea.value = codeBlock.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Visual feedback
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.style.background = '#28a745';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 2000);
}

// Search functionality for main content
const searchBox = document.getElementById('searchBox');
if (searchBox) {
    searchBox.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            const cards = section.querySelectorAll('.card');
            
            if (text.includes(searchTerm) || searchTerm === '') {
                section.style.display = 'block';
                cards.forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                section.style.display = 'none';
            }
        });
    });
}

// Sidebar search functionality
const sidebarSearch = document.getElementById('sidebarSearch');
if (sidebarSearch) {
    sidebarSearch.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (searchTerm === '') {
        // Show all items when search is empty
        accordionItems.forEach(item => {
            item.style.display = 'block';
        });
        navLinks.forEach(link => {
            link.style.display = 'block';
        });
        return;
    }
    
    // Hide all accordion items first
    accordionItems.forEach(item => {
        item.style.display = 'none';
    });
    
    // Show matching items
    navLinks.forEach(link => {
        const linkText = link.textContent.toLowerCase();
        if (linkText.includes(searchTerm)) {
            link.style.display = 'block';
            // Show the parent accordion item
            const accordionItem = link.closest('.accordion-item');
            if (accordionItem) {
                accordionItem.style.display = 'block';
                // Expand the accordion section
                const accordionButton = accordionItem.querySelector('.accordion-button');
                const accordionCollapse = accordionItem.querySelector('.accordion-collapse');
                if (accordionButton && accordionCollapse) {
                    accordionButton.classList.remove('collapsed');
                    accordionCollapse.classList.add('show');
                }
            }
        } else {
            link.style.display = 'none';
        }
    });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Enhanced accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop();
    
    // Find and highlight the current page link
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            // Expand the parent accordion section
            const accordionItem = link.closest('.accordion-item');
            if (accordionItem) {
                const accordionButton = accordionItem.querySelector('.accordion-button');
                const accordionCollapse = accordionItem.querySelector('.accordion-collapse');
                if (accordionButton && accordionCollapse) {
                    accordionButton.classList.remove('collapsed');
                    accordionButton.classList.add('active');
                    accordionCollapse.classList.add('show');
                }
            }
        }
    });

    // Restore active accordion button from localStorage
    const savedActiveButton = localStorage.getItem('activeAccordionButton');
    if (savedActiveButton) {
        const activeButton = document.getElementById(savedActiveButton);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    // Enhanced accordion button interactions
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active state for the clicked button
            if (this.classList.contains('active')) {
                // If already active, remove active class
                this.classList.remove('active');
                localStorage.removeItem('activeAccordionButton');
            } else {
                // Remove active class from all buttons first
                accordionButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Save active button to localStorage
                localStorage.setItem('activeAccordionButton', this.id);
            }
            
            // Add visual feedback
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });

        // Add hover effects
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active') && !this.classList.contains('collapsed')) {
                this.style.transform = 'scale(1.01)';
            }
        });

        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
            }
        });
    });

    // Keep accordion sections open when clicking on links inside
    const accordionLinks = document.querySelectorAll('.accordion-body .nav-link');
    accordionLinks.forEach(link => {
        link.addEventListener('click', function() {
            const accordionItem = this.closest('.accordion-item');
            if (accordionItem) {
                const accordionButton = accordionItem.querySelector('.accordion-button');
                if (accordionButton) {
                    // Keep the section open
                    accordionButton.classList.remove('collapsed');
                    accordionButton.classList.add('active');
                }
            }
        });
    });
});

// Initialize Prism.js
document.addEventListener('DOMContentLoaded', function() {
    Prism.highlightAll();
});
