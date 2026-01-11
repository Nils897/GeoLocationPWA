// Import React and ReactDOM
import React from 'react';
import { createRoot } from 'react-dom/client';

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-React Plugin
import Framework7React from 'framework7-react';

// Import Framework7 Styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import App Component
import App from '../components/app.jsx';

// Import Push logic
import {
    isPushSupported,
    requestPushPermission,
    subscribeToPush
} from './push';

// Init Framework7 React Plugin
Framework7.use(Framework7React);

// Initialize Push Notifications once on app start
async function initPushNotifications() {
    if (!isPushSupported()) {
        console.log('Push notifications are not supported in this browser');
        return;
    }

    try {
        const permissionGranted = await requestPushPermission();
        if (!permissionGranted) {
            console.log('Push permission denied by user');
            return;
        }

        await subscribeToPush();
    } catch (error) {
        console.error('Push initialization failed:', error);
    }
}

// Run push initialization after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initPushNotifications();
});

// Mount React App
const root = createRoot(document.getElementById('app'));
root.render(React.createElement(App));
