import React, { useEffect, useState } from "react";
import './styles/Refresh.css';

function RefreshSection() {
  const [status, setStatus] = useState("Refreshing...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const deleteFiles = async () => {
      try {
        const response = await fetch("http://localhost:9090/refresh", {
          method: "GET",
        });

        if (response.ok) {
          console.log(response)
          setStatus("✅ Files deleted successfully.");
        } else {
          setStatus("❌ Failed to delete files.");
        }
      } catch (error) {
        console.error("Refresh error:", error);
        setStatus("🚫 Server error while deleting files.");
      } finally {
        setLoading(false);
      }
    };

    deleteFiles();
  }, []);

  return (
    <div className="refresh-section">
      {loading ? (
        <p>🔄 Deleting files...</p>
      ) : (
        <p>{status}</p>
      )}
    </div>
  );
}

export default RefreshSection;
