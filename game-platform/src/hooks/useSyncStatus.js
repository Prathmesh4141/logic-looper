import { useState, useEffect } from "react";

export default function useSyncStatus() {
  const [status, setStatus] = useState(navigator.onLine ? "online" : "offline");

  useEffect(() => {
    const goOnline = () => setStatus("online");
    const goOffline = () => setStatus("offline");

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return [status, setStatus];
}
