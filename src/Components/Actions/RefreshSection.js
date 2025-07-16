import React, { useEffect, useState } from "react";
import './styles/Refresh.css';

function RefreshSection({
  setFileUploaded,
  setLoadedToDB,
  setTransformed,
  setSelectedFile,
  setPlatform
}) {
  const [structure, setStructure] = useState(null);
  const [status, setStatus] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [structureLoaded, setStructureLoaded] = useState(false);

  useEffect(() => {
    fetchStructure(); // Auto-fetch on component mount
  }, []);

  const fetchStructure = async () => {
    try {
      const response = await fetch("http://localhost:9090/refresh-structure");
      const data = await response.json();

      if (Object.keys(data).length === 0) {
        setStatus("📁 Folder is already empty.");
      } else {
        setStructure(data);
        setStructureLoaded(true);
        setStatus("");
      }
    } catch (error) {
      console.error("Error fetching structure:", error);
      setStatus("🚫 Failed to load folder structure.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch("http://localhost:9090/refresh", {
        method: "GET",
      });
      if (response.ok) {
        const msg = await response.text();
        setStatus(`✅ ${msg}`);
        setStructure(null);
        setStructureLoaded(false);

        // Also reset state in Container
        setFileUploaded(false);
        setLoadedToDB(false);
        setTransformed(false);
        setSelectedFile(null);
        setPlatform('');
      } else {
        setStatus("❌ Failed to delete files.");
      }
    } catch (error) {
      console.error("Error during delete:", error);
      setStatus("🚫 Server error while deleting files.");
    } finally {
      setDeleting(false);
    }
  };

  const renderTree = (node) => {
    return Object.entries(node).map(([key, value]) => {
      if (typeof value === 'object') {
        return (
          <div key={key} className="folder">
            📁 {key}
            <div className="subfolder">{renderTree(value)}</div>
          </div>
        );
      } else {
        return (
          <div key={key} className="file">
            📄 {value}
          </div>
        );
      }
    });
  };

  return (
    <div className="refresh-section">
        <>
          <div className="folder-view">{renderTree(structure)}</div>
          <button onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "🗑️ Confirm Delete"}
          </button>
        </>
    </div>
  );
}

export default RefreshSection;
