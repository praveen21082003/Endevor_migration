import { useState, useEffect } from "react";
import "./styles/Load.css";

function LoadSection({ selectedFile, onLoadMongo, onLoadDB2, setLoadedToDB }) {
  const [selectedDB, setSelectedDB] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    if (selectedFile && selectedDB) {
      handleLoad(selectedDB);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDB, selectedFile]);

  const handleLoad = async (db) => {
    setLoading(true);
    setProgress(0);
    setBackendMessage('');

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next >= 90) clearInterval(interval);
        return next;
      });
    }, 300);

    try {
      let response;
      if (db === 'mongo') {
        response = await onLoadMongo();
      } else if (db === 'db2') {
        response = await onLoadDB2();
      }

      const text = await response.text();
      const cleanedText = text.trim().toLowerCase();
      setBackendMessage(text);

      // Check for success in response content
      if (cleanedText.includes("ok") || cleanedText.includes("success")) {
        setLoadedToDB(true);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setBackendMessage("🚫 Error while uploading.");
    } finally {
      clearInterval(interval);
      setProgress(100);
      setLoading(false);
    }
  };

  const handleDBSelect = (db) => {
    if (!selectedFile) {
      alert("⚠️ Please upload a JSON file first.");
      return;
    }
    setSelectedDB(db);
  };

  return (
    <div className="load_section">
      {!selectedDB ? (
        <>
          <button className="loadbtns" onClick={() => handleDBSelect('mongo')}>
            Load to MongoDB
          </button>
          <button className="loadbtns" onClick={() => handleDBSelect('db2')}>
            Load to DB2
          </button>
        </>
      ) : (
        <>
          {loading ? (
            <>
              <div className="progress_wrapper">
                <div className="progress_bar" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="loading_text">
                Uploading to {selectedDB.toUpperCase()}... ({progress}%)
              </p>
            </>
          ) : (
            <p className="success_text">✅ {backendMessage}</p>
          )}
        </>
      )}
    </div>
  );
}

export default LoadSection;
