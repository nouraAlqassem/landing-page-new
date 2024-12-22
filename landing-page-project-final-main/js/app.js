// Get all sections and the navigation container
const sections = document.querySelectorAll('section');
const navBar = document.getElementById('navbar__list');

// Create a "Scroll to Top" button
const scrollToTopButton = document.createElement('button');
scrollToTopButton.id = 'scroll-to-top';
scrollToTopButton.textContent = 'Top';
document.body.appendChild(scrollToTopButton);

// Flag to prevent redundant operations during smooth scrolling
let isScrolling = false;

/**
 * Build the navigation dynamically based on sections
 */
const buildNavigation = () => {
    // Create a fragment to improve performance
    const fragment = document.createDocumentFragment();

    sections.forEach(section => {
        // Create a list item and anchor tag for each section
        const navItem = document.createElement('li');
        const navLink = document.createElement('a');

        // Set attributes and text for the navigation link using data-section-id
        navLink.href = `#${section.id}`;
        navLink.textContent = section.dataset.nav;
        navLink.classList.add('menu__link');

        // Append the link to the list item and the list item to the fragment
        navItem.appendChild(navLink);
        fragment.appendChild(navItem);
    });

    // Append the fragment to the navbar
    navBar.appendChild(fragment);
};

/**
 * Add or remove the "active" class based on the visible section
 */
const setActiveSection = () => {
    if (isScrolling) return; // Prevent operations during smooth scrolling

    sections.forEach(section => {
        const bounding = section.getBoundingClientRect();
        const isInViewport = bounding.top >= 0 && bounding.top < window.innerHeight / 2;

        if (isInViewport && !section.classList.contains('active')) {
            // Remove the active class from all sections
            sections.forEach(sec => sec.classList.remove('active'));
            section.classList.add('active'); // Add the active class

            // Update the active link in the navigation bar
            const navLink = navBar.querySelector(`a[href="#${section.id}"]`);
            navBar.querySelectorAll('a').forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
        }
    });
};

/**
 * Enable smooth scrolling when clicking navigation links
 */
const enableSmoothScrolling = () => {
    navBar.addEventListener('click', event => {
        // Check if the clicked target is a link
        if (event.target.tagName === 'A') {
            event.preventDefault();

            isScrolling = true; // Prevent redundant operations during scrolling

            const targetSection = document.querySelector(event.target.getAttribute('href'));
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Allow updates after scrolling is complete
                setTimeout(() => {
                    setActiveSection();
                    isScrolling = false;
                }, 500);
            }
        }
    });
};

/**
 * Show or hide the navigation bar based on scrolling
 */
let scrollTimeout;
const handleNavBarVisibility = () => {
    navBar.style.display = 'block';

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        navBar.style.display = 'none';
    }, 4000);
};

/**
 * Show or hide the "Scroll to Top" button
 */
const handleScrollToTopButton = () => {
    scrollToTopButton.style.display = window.scrollY > 400 ? 'block' : 'none';
};

/**
 * Scroll to the top of the page when the button is clicked
 */
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Initialize all functions
buildNavigation();
enableSmoothScrolling();
scrollToTopButton.addEventListener('click', scrollToTop);

// Add scroll event listeners for additional functionality
document.addEventListener('scroll', () => {
    setActiveSection();
    handleNavBarVisibility();
    handleScrollToTopButton();
});

