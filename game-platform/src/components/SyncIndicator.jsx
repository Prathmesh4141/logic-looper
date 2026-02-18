export default function SyncIndicator({ status }) {
    const styles = {
      online: {
        color: "text-green-400",
        dot: "bg-green-400",
        text: "Online & Synced",
      },
      offline: {
        color: "text-yellow-400",
        dot: "bg-yellow-400",
        text: "Offline — progress saved",
      },
      syncing: {
        color: "text-blue-400",
        dot: "bg-blue-400",
        text: "Syncing…",
      },
      failed: {
        color: "text-red-400",
        dot: "bg-red-400",
        text: "Sync failed",
      },
    };
  
    const current = styles[status] || styles.online;
  
    return (
      <div className={`flex items-center gap-2 text-xs ${current.color}`}>
        <span className={`w-2 h-2 rounded-full ${current.dot}`}></span>
        {current.text}
      </div>
    );
  }
  