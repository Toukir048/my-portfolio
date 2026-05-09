# Toukir Sarder Portfolio

A modern personal portfolio website built with React, Tailwind CSS, DaisyUI, and React Router. It presents profile information, skills, education, experience, selected projects, and contact options through a polished responsive interface.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0f172a)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=ffffff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=ffffff)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=ffffff)

## Overview

This portfolio is designed to feel fast, elegant, and professional on every screen size. Content is data-driven through JSON files in the `public` folder, making it easy to update profile details, skills, links, education, experience, and project information without digging through component code.

## Features

- Fully responsive layout for mobile, tablet, and desktop
- Sticky glass-style navigation with smooth section scrolling
- Dark and light theme support with local preference saving
- Animated hero section with profile image, resume download, and social links
- Data-driven sections for profile, skills, education, experience, and projects
- Project details pages powered by React Router
- Contact section with email, phone, WhatsApp, LinkedIn, and GitHub links
- Smooth reveal animations and refined UI interactions
- Production-ready Vite build setup

## Tech Stack

| Category | Technologies |
| --- | --- |
| Frontend | React, JavaScript, React Router |
| Styling | Tailwind CSS, DaisyUI, custom CSS variables |
| Icons | React Icons |
| Build Tool | Vite |
| Data | JSON files served from `public` |

## Project Structure

```text
my-portfolio/
+-- public/
|   +-- profile.json
|   +-- links.json
|   +-- skills.json
|   +-- education.json
|   +-- experiences.json
|   +-- projects.json
|   +-- profile.png
|   +-- resume.pdf
+-- src/
|   +-- App.jsx
|   +-- index.css
|   +-- main.jsx
+-- index.html
+-- package.json
+-- README.md
```

## Getting Started

### Prerequisites

Install Node.js and npm on your machine.

### Installation

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint the Project

```bash
npm run lint
```

## Customization

Most portfolio content can be updated from the `public` folder:

- `profile.json` controls name, designation, intro text, contact information, profile image, and resume path.
- `links.json` controls social and contact links.
- `skills.json` controls skill categories and progress values.
- `education.json` controls academic information.
- `experiences.json` controls experience or activity entries.
- `projects.json` controls project cards and project detail pages.

To replace images or resume files, add the new assets inside `public` and update the matching JSON paths.

## Deployment

This project can be deployed to platforms such as Netlify, Vercel, or GitHub Pages.

For most hosting platforms:

```bash
npm run build
```

Then deploy the generated `dist` folder.

## Highlighted Projects

- **KeenKeeper Friend Tracking App**: A responsive friend-tracking app with check-ins, timeline history, statistics, and localStorage support.
- **Class Routine Web App**: A student-friendly class routine interface with filtering and responsive schedule views.
- **Weather App**: A city-based weather application focused on API handling, error states, and clean UI presentation.

## Author

**Toukir Sarder**  
Frontend Developer, React Developer, and Competitive Programmer

- GitHub: [Toukir048](https://github.com/Toukir048)
- Email: [anjumtanvir117@gmail.com](mailto:anjumtanvir117@gmail.com)

## License

This project is available for personal portfolio use. Add a dedicated license file if you plan to publish it as an open-source template.
