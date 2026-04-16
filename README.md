# Examination System

A MERN-stack application for managing and taking multiple-choice examinations.

## Core Features

- **Teacher Management**: Create questions with image support and generate unique exam forms.
- **Randomization**: Automatic shuffling of questions and options to ensure exam integrity.
- **Student Portal**: Secure exam sessions with timed tracking.
- **Reporting**: Real-time results and Excel export functionality.

## Tech Stack

- **Frontend**: React, TanStack Query, Tailwind CSS.
- **Backend**: Node.js, Express, MongoDB, Redis (optional timer fallback).

## Setup

### 1. Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Configuration
Update the `.env` files in both `frontend` and `backend` directories with your database and API credentials.
