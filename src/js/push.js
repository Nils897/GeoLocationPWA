/**
 * push.js
 *
 * Handles Push Notification setup for the Progressive Web Application.
 *
 * Responsibilities:
 * - Request notification permission from the user
 * - Create a Push Subscription via the Push API
 * - Provide the subscription object for backend transmission
 *
 * This file contains application logic and must NOT be placed
 * inside UI components (e.g. JSX / Vue / React components).
 */

/**
 * Public VAPID key provided by the push server.
 * Must be replaced with your own key.
 */
const VAPID_PUBLIC_KEY = '<YOUR_PUBLIC_VAPID_KEY>';

/**
 * Checks whether the current browser environment supports
 * Service Workers and Push Notifications.
 *
 * @returns {boolean} true if Push API is supported, otherwise false
 */
export function isPushSupported() {
    return (
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window
    );
}

/**
 * Requests permission from the user to display notifications.
 *
 * @returns {Promise<boolean>} true if permission was granted
 */
export async function requestPushPermission() {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
}

/**
 * Creates a push subscription using the Push API.
 *
 * The subscription uniquely identifies the user's browser instance
 * and must be sent to a backend server to trigger push messages.
 *
 * @returns {Promise<PushSubscription>} The created push subscription
 */
export async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    console.log('Push subscription created:', subscription);

    return subscription;
}

/**
 * Optional helper to unsubscribe the user from push notifications.
 *
 * @returns {Promise<boolean>} true if unsubscribed successfully
 */
export async function unsubscribeFromPush() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
        return false;
    }

    return subscription.unsubscribe();
}

/**
 * Converts a Base64 URL-safe encoded VAPID public key
 * into a Uint8Array as required by the Push API.
 *
 * @param {string} base64String - URL-safe Base64 encoded string
 * @returns {Uint8Array} Converted public key
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}
