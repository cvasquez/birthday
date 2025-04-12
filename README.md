# Birthday Website Builder

A React application for creating personalized birthday webpages for children.

## Firebase Authentication Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication in the Firebase Console
3. Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## Features

- Passwordless email authentication using magic links
- Secure user session management
- Modern, responsive UI with Tailwind CSS
- TypeScript for type safety
- ESLint for code quality
- Fast development with Vite

## Project Structure

- `src/config/firebase.ts` - Firebase configuration
- `src/contexts/AuthContext.tsx` - Authentication context and provider
- `src/components/SignInForm.tsx` - Magic link sign-in form component
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration 