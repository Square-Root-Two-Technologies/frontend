# √2 Technologies - Blog Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-6.30.0-CA4245?logo=react-router)](https://reactrouter.com/)
[![Tiptap Editor](https://img.shields.io/badge/Tiptap-2.11.7-black?logo=tiptap)](https://tiptap.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.6.3-purple?logo=framer)](https://www.framer.com/motion/)
A modern, feature-rich blogging application built with React, Tailwind CSS, and
Tiptap. It allows users to read, create, manage posts, and interact with a
dynamic user interface featuring animations and a dark/light theme toggle.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Screenshots](#screenshots) (Add Your Own!)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
  - [Development Mode](#development-mode)
  - [Production Build](#production-build)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Overview

This application serves as a platform for users to read blog posts on various
topics like Technology, Salesforce, JavaScript, Life, etc. Authenticated users
can create, edit, and delete their own posts using a rich text editor. It
features infinite scrolling for Browse posts, a dedicated section for featured
content, user profile management, and admin capabilities.

---

## Key Features

- **User Authentication:** Secure Login and Signup functionality.
- **CRUD Operations:** Create, Read, Update, and Delete blog posts (notes).
- **Rich Text Editor:** Utilizes Tiptap for a WYSIWYG editing experience (bold,
  italics, lists, code blocks, links, images).
- **Post Categorization:** Posts are organized by 'Type' (e.g., JavaScript,
  Technology).
- **Featured Posts:** Horizontally scrolling section showcasing highlighted
  posts.
- **Infinite Scrolling:** Seamlessly loads more posts as the user scrolls down
  the main feed.
- **Responsive Design:** Adapts to various screen sizes using Tailwind CSS.
- **Dark/Light Mode:** Theme toggling with persistence via `localStorage`.
- **User Profiles:** View and edit user profile information (name, email).
- **Admin Role:** Admins have additional privileges, such as marking posts as
  featured and potentially managing all users' posts.
- **Protected Routes:** Ensures only authenticated users can access certain
  pages (e.g., My Notes, Add/Edit Note, Profile).
- **Blog Card Animations:** Subtle, type-specific background animations on blog
  cards using Framer Motion.
- **Search Functionality:** Navbar includes a search input (Note: Backend search
  implementation details not fully visible in provided frontend code).
- **State Management:** Uses React Context API for managing Notes, User, and
  Theme state globally.

---

## Screenshots

_(**Note:** Please add screenshots of your application here!)_

| _Example:_                                            | Home Page (Light) | Single Post Page (Dark) | Add Note Page |     |
| :---------------------------------------------------- | ----------------- | ----------------------- | ------------- | --- |
| :---------------------------------------------------  |
| :---------------------------------------------------- |                   |
| ![Home Page Light](link/to/your/screenshot_home.png)  |
| ![Single Post Dark](link/to/your/screenshot_post.png) |
| ![Add Note Page](link/to/your/screenshot_addnote.png) |

---

## Tech Stack

- **Frontend:**
  - [React](https://reactjs.org/) (v18.2.0) - UI Library
  - [React Router DOM](https://reactrouter.com/) (v6.30.0) - Routing
  - [Tailwind CSS](https://tailwindcss.com/) (v4.1.3) - Utility-First CSS
    Framework
  - [Tiptap](https://tiptap.dev/) (v2.11.7) - Headless Rich Text Editor
    Framework
  - [Framer Motion](https://www.framer.com/motion/) (v12.6.3) - Animation
    Library
  - [React Icons](https://react-icons.github.io/react-icons/) (v5.5.0) - Icon
    Library
  - [React Context API](https://reactjs.org/docs/context.html) - State
    Management
- **Build Tool:**
  [Create React App (react-scripts v5.0.1)](https://create-react-app.dev/)
- **Testing:**
  [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/)
- **Backend:** (Assumed based on context code) - Likely Node.js/Express with
  MongoDB (or similar NoSQL DB) based on API call structure (`/api/notes/...`,
  `/api/auth/...`).

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your
local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended - e.g., v18 or v20)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- **A running instance of the backend server.** This frontend requires a backend
  API to function correctly. The context files (`NoteState.js`, `UserState.js`)
  point towards API endpoints like `/api/auth/login`, `/api/notes/addnote`,
  etc., hosted at the URL specified in the environment variables (see below).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd squareroottwotechnologies
    ```

2.  **Install dependencies:** Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

### Environment Variables

This project requires a connection to a backend API. Create a `.env` file in the
root of the project directory and add the following variable:

```env
REACT_APP_BACKEND=http://localhost:5000
```
