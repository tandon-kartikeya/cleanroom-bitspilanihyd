# Cleanroom Booking System - BITS Pilani Hyderabad

A React-based web application for managing cleanroom bookings at BITS Pilani Hyderabad campus.

## Overview

This application provides a system for students, faculty, and administrators to manage bookings for the cleanroom facility. It includes different interfaces for students, faculty, and admins with role-based access control.

## Features

- **User Authentication**: Google Sign-In integration with role-based access
- **Student Dashboard**: Request bookings and view status
- **Faculty Dashboard**: Approve/reject booking requests
- **Admin Dashboard**: Manage equipment, users, and view all bookings
- **Real-time Updates**: Uses Firebase Firestore for real-time data

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Firebase account with Firestore and Authentication enabled

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tandon-kartikeya/cleanroom-bitspilanihyd.git
cd cleanroom-bitspilanihyd
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_ADMIN_USERNAME=your_admin_username
REACT_APP_ADMIN_PASSWORD=your_admin_password
```

You can find these values in your Firebase project settings.

### 4. Run the development server

```bash
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Google provider
3. Create a Firestore database
4. In the project settings, register a new web app to get your Firebase config
5. Copy the Firebase configuration values to your `.env` file

## Deployment

### Deploy to Firebase Hosting

1. Install Firebase CLI if not already installed:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase (skip if firebase.json already exists):
```bash
firebase init
```
   - Select Hosting and Firestore features
   - Choose your Firebase project
   - Set "build" as your public directory
   - Configure as a single-page app

4. Build the project:
```bash
npm run build
```

5. Deploy to Firebase:
```bash
firebase deploy
```

## Development Notes

- For local development, the Google authentication is configured to accept any email. In production, uncomment the domain restriction in `src/utils/firebase.js` to restrict access to BITS Pilani domain emails.

## Folder Structure

```
cleanroom-bitspilanihyd/
├── public/             # Public assets
├── src/                # Source code
│   ├── assets/         # Static assets
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   │   └── firebase.js # Firebase configuration
│   ├── App.js          # Main application component
│   └── index.js        # Entry point
├── firebase.json       # Firebase configuration
├── firestore.rules     # Firestore security rules
└── package.json        # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
