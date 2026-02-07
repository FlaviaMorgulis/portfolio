# Portfolio Website with AI Chatbot - Build Plan to be updated with architecture plan, UI prototype

## Phase 1: Basic Setup ✓

- [✓ ] Create project folders (templates, static/css, static/js, static/images)
- [✓ ] Create app.py
- [✓ ] Create requirements.txt
- [ ✓] Add .gitignore
- [✓ ] Create basic index.html

## Phase 2: HTML Templates

- [✓ ] Create base.html (template that other pages will extend)
- [✓ ] Complete index.html (home page with introduction)
- [ ✓] Create about.html (your background, skills, education)
- [✓ ] Create projects.html (showcase your projects)
- [✓ ] Create contact.html (contact form and info)

## Phase 3: Styling

- [✓ ] Create main CSS file (style.css)
- [ ✓] Add navigation bar styling
- [ ✓] Style the home page
- [✓ ] Style about, projects, and contact pages
- [✓ ] Make it responsive (mobile-friendly)

## Phase 4: Chatbot Widget

- [✓ ] Create chatbot UI (chat window HTML/CSS)
- [✓ ] Add JavaScript for chat interactions
- [✓ ] Add voice interface (speech-to-text and text-to-speech)
  - [✓ ] Add microphone button for voice input
  - [✓ ] Add speaker toggle for voice responses
  - [ ✓] Implement Web Speech API integration
- [ ] Create a file with CV data (cv_data.txt or cv_data.json)
- [ ] Get OpenAI API key (or choose another AI service)
- [ ] Update .env file with API key
- [ ] Implement chatbot backend in app.py
- [ ] Connect voice features to backend responses
- [ ] Test chatbot with CV questions

## Phase 5: Content Preparation

- [ ] Write bio and personal statement
- [ ] List all work experiences with dates, roles, responsibilities
- [ ] Document all projects (title, description, technologies, GitHub links, live demos)
- [ ] List technical skills by category (languages, frameworks, tools, databases)
- [ ] Add education history
- [ ] Gather/create images (headshot, project screenshots, company logos)
- [ ] Prepare CV data for chatbot (extract key info into structured format)

## Phase 6: Polish & Deploy

- [ ] Add all content to the website pages
- [ ] Test all pages and functionality
- [ ] Add favicon and meta tags
- [ ] Write README.md with setup instructions
- [ ] Deploy to hosting service (Render, Heroku, PythonAnywhere, etc.)

Folder structure :
Website with bot using Flask/
├── app.py # Main Flask application
├── requirements.txt # Python dependencies
├── .gitignore # Git ignore file
├── templates/ # HTML templates
│ └── index.html
└── static/ # Static files (CSS, JS, images)
├── css/
├── js/
└── images/
