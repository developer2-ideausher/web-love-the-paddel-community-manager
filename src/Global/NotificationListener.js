import { app } from "@/services/firebase-services/firebase";
import { useFcmToken } from "@/services/firebase-services/useFcmToken";
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import { X } from "lucide-react";
import { Fragment, useEffect } from "react";
import { toast } from "react-toastify";

export const NotificationListener = () => {
    const { fcmToken, notificationPermissionStatus } = useFcmToken();

    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            
            const messaging = getMessaging(app);
            
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((registration) => {
                    console.log("Service Worker registered successfully:", registration);
                })
                .catch((error) => {
                    console.error("Service Worker registration failed:", error);
                });

            const unsubscribe = onMessage(messaging, (payload) => {
                toast(
                  ({ closeToast }) => (
                    <div className="w-[360px] flex justify-between items-center rounded-2xl px-4 py-3" style={{ backgroundColor: '#D4EDDA' }}>
                      <div className="flex flex-col justify-start gap-y-1 pr-4">
                        <p className="font-semibold text-[15px] text-blackText">{payload.notification.title}</p>
                        <p className="font-normal text-xs text-blackText">{payload.notification.body}</p>
                      </div>
                      <div
                        onClick={closeToast}
                        className="h-8 w-8 rounded-full flex justify-center items-center cursor-pointer"
                        style={{ backgroundColor: '#FFFFFF' }}
                      >
                        <X className="size-4" />
                      </div>
                    </div>
                  ),
                  {
                    autoClose: 4000,
                    closeButton: false,
                    hideProgressBar: true,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                  }
                );
              });
              

            if (unsubscribe) {
            }

            return () => {
                unsubscribe(); 
            };
        }
    }, [])

    return (
        <Fragment>

        </Fragment>
    )
}