// ===== Theme Management =====
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

// Theme toggle handler
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ===== Navigation =====
const letsGoBtn = document.getElementById('lets-go-btn');
if (letsGoBtn) {
    letsGoBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}

// ===== Tab Management =====
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        // Remove active class from all tabs and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// ===== Category Filtering =====
const categoryTags = document.querySelectorAll('.category-tag');
let activeCategory = 'all';

categoryTags.forEach(tag => {
    tag.addEventListener('click', () => {
        // Remove active class from all tags
        categoryTags.forEach(t => t.classList.remove('active'));

        // Add active class to clicked tag
        tag.classList.add('active');

        // Update active category
        activeCategory = tag.getAttribute('data-category');

        // Filter cards (will be implemented when cards are loaded)
        filterCards(activeCategory);
    });
});

function filterCards(category) {
    const myCards = document.querySelectorAll('#my-cards-grid .flash-card');
    const publicCards = document.querySelectorAll('#public-cards-grid .flash-card');

    const allCards = [...myCards, ...publicCards];

    allCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== Modal Management =====
const createCardModal = document.getElementById('create-card-modal');
const createMyCardBtn = document.getElementById('create-my-card');
const closeModalBtn = document.getElementById('close-modal');
const cancelCardBtn = document.getElementById('cancel-card');

if (createMyCardBtn) {
    createMyCardBtn.addEventListener('click', () => {
        createCardModal.classList.add('active');
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        createCardModal.classList.remove('active');
        resetCardForm();
    });
}

if (cancelCardBtn) {
    cancelCardBtn.addEventListener('click', () => {
        createCardModal.classList.remove('active');
        resetCardForm();
    });
}

// Close modal when clicking outside
if (createCardModal) {
    createCardModal.addEventListener('click', (e) => {
        if (e.target === createCardModal) {
            createCardModal.classList.remove('active');
            resetCardForm();
        }
    });
}

// ===== Flash Card Creation =====
const cardForm = document.getElementById('card-form');
let myCards = JSON.parse(localStorage.getItem('myCards')) || [];

if (cardForm) {
    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const category = document.getElementById('card-category').value;
        const question = document.getElementById('card-question').value;
        const answer = document.getElementById('card-answer').value;

        const newCard = {
            id: Date.now(),
            category,
            question,
            answer,
            createdAt: new Date().toISOString()
        };

        myCards.push(newCard);
        localStorage.setItem('myCards', JSON.stringify(myCards));

        renderMyCards();
        createCardModal.classList.remove('active');
        resetCardForm();
    });
}

function resetCardForm() {
    if (cardForm) {
        cardForm.reset();
    }
}

// ===== Render Cards =====
function renderMyCards() {
    const myCardsGrid = document.getElementById('my-cards-grid');

    if (!myCardsGrid) return;

    if (myCards.length === 0) {
        myCardsGrid.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="20" width="60" height="40" rx="4" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M40 35V45M35 40H45" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p>No cards yet. Create your first flashcard!</p>
            </div>
        `;
        return;
    }

    myCardsGrid.innerHTML = myCards.map(card => `
        <div class="flash-card" data-category="${card.category}" data-id="${card.id}">
            <div class="flash-card-inner">
                <div class="flash-card-front">
                    <span class="flash-card-category">${capitalizeFirst(card.category)}</span>
                    <div class="flash-card-label">Question</div>
                    <div class="flash-card-question">${escapeHtml(card.question)}</div>
                </div>
                <div class="flash-card-back">
                    <span class="flash-card-category">${capitalizeFirst(card.category)}</span>
                    <div class="flash-card-label">Answer</div>
                    <div class="flash-card-answer">${escapeHtml(card.answer)}</div>
                </div>
            </div>
        </div>
    `).join('');

    // Add click event listeners for flip effect
    addFlipListeners();

    // Apply current filter
    filterCards(activeCategory);
}

// Sample public cards (in real app, these would come from a database)
const publicCards = [
    {
        id: 1,
        category: 'science',
        question: 'What is photosynthesis?',
        answer: 'The process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar.'
    },
    {
        id: 2,
        category: 'math',
        question: 'What is the Pythagorean theorem?',
        answer: 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c²'
    },
    {
        id: 3,
        category: 'programming',
        question: 'What is a variable?',
        answer: 'A named storage location in memory that holds a value which can be changed during program execution.'
    },
    {
        id: 4,
        category: 'history',
        question: 'When did World War II end?',
        answer: 'World War II ended in 1945, with Germany surrendering in May and Japan in September.'
    },
    {
        id: 5,
        category: 'language',
        question: 'What is a metaphor?',
        answer: 'A figure of speech that describes an object or action in a way that is not literally true but helps explain an idea or make a comparison.'
    }
];

function renderPublicCards() {
    const publicCardsGrid = document.getElementById('public-cards-grid');

    if (!publicCardsGrid) return;

    if (publicCards.length === 0) {
        publicCardsGrid.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="20" width="60" height="40" rx="4" stroke="currentColor" stroke-width="2" fill="none"/>
                    <circle cx="40" cy="40" r="8" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                <p>No public cards available. Check back later!</p>
            </div>
        `;
        return;
    }

    publicCardsGrid.innerHTML = publicCards.map(card => `
        <div class="flash-card" data-category="${card.category}" data-id="${card.id}">
            <div class="flash-card-inner">
                <div class="flash-card-front">
                    <span class="flash-card-category">${capitalizeFirst(card.category)}</span>
                    <div class="flash-card-label">Question</div>
                    <div class="flash-card-question">${escapeHtml(card.question)}</div>
                </div>
                <div class="flash-card-back">
                    <span class="flash-card-category">${capitalizeFirst(card.category)}</span>
                    <div class="flash-card-label">Answer</div>
                    <div class="flash-card-answer">${escapeHtml(card.answer)}</div>
                </div>
            </div>
        </div>
    `).join('');

    // Add click event listeners for flip effect
    addFlipListeners();

    // Apply current filter
    filterCards(activeCategory);
}

// ===== Auth Forms =====
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // In a real app, this would authenticate with a backend
        console.log('Login attempt:', { email, password });

        // For demo purposes, just redirect to home
        alert('Login functionality will be connected to database. Redirecting to home...');
        window.location.href = 'index.html';
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // In a real app, this would save to a database
        console.log('Signup attempt:', { firstName, lastName, username, email, password });

        // For demo purposes, just redirect to login
        alert('Signup functionality will be connected to database. Redirecting to login...');
        window.location.href = 'login.html';
    });
}

// ===== Flip Card Functionality =====
function addFlipListeners() {
    const flashCards = document.querySelectorAll('.flash-card');
    flashCards.forEach(card => {
        card.addEventListener('click', function () {
            this.classList.toggle('flipped');
        });
    });
}

// ===== Utility Functions =====
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    renderMyCards();
    renderPublicCards();
});
