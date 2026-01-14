import { useEffect, useState } from "react";
import { generateFCMToken } from "./firebase.notification";
import { getToken } from "./cookies";

export const useFcmToken = () => {
    const [token, setToken] = useState('');
    const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

    useEffect(() => {
        const retrieveToken = async () => {
            try {
                const authToken = getToken();
                if (!authToken) {
                    console.warn("Auth token not found in cookies. Skipping FCM token generation.");
                    return;
                }
                const token = await generateFCMToken();
                if (token) {
                    setToken(token);
                    setNotificationPermissionStatus('granted');
                }
            } catch (error) {
                console.error("Failed to retrieve FCM token:", error);
                setNotificationPermissionStatus('denied');
            }
        };

        retrieveToken();
    }, []);

    return { fcmToken: token, notificationPermissionStatus };
};
