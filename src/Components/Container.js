import './Styles/Container.css';
import { useState, useEffect, useCallback } from "react";
import ExtractSection from "./Actions/ExtractSection";
import LoadSection from "./Actions/LoadSection";
import TransformSection from "./Actions/TransformSection";
import ValidateSection from "./Actions/ValidateSection";
import VideoSection from "./Actions/VideoSection";
import RefreshSection from './Actions/RefreshSection';
import Mapping from './Actions/Mapping'; // ✅ Import your new Mapping component

function Container({
  action,
  fileUploaded,
  setFileUploaded,
  loadedToDB,
  setLoadedToDB,
  transformed,
  setTransformed
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [platform, setPlatform] = useState('');
  const [transformOutput, setTransformOutput] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
      setFileUploaded(true);
      setSuccess(false);
    } else {
      alert("Please upload a valid JSON file.");
    }
  };

  const handleLoadToMongo = useCallback(async () => {
    if (!selectedFile) {
      alert("Please upload a file first in the 'Extract' section.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:9090/extract", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await response.text();
        setSuccess(true);
        setLoadedToDB(true);
      } else {
        alert("❌ Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("🚫 Server error");
    } finally {
      setLoading(false);
    }
  }, [selectedFile, setLoadedToDB]);

  const handleLoadToDB2 = useCallback(async () => {
    if (!selectedFile) {
      alert("Please upload a file first.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:9090/extractdb2", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await response.text();
        setSuccess(true);
        setLoadedToDB(true);
      } else {
        alert("❌ DB2 Upload failed");
      }
    } catch (error) {
      console.error("DB2 Upload error:", error);
      alert("🚫 DB2 Server error");
    } finally {
      setLoading(false);
    }
  }, [selectedFile, setLoadedToDB]);

  const handleTransform = useCallback(async () => {
    if (!platform) {
      alert("⚠️ Please select either a source or a target platform.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:9090/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platform }),
      });

      if (response.ok) {
        const result = await response.text();
        setTransformOutput(result);
        setSuccess(true);  
        setTransformed(true);
      } else {
        alert("❌ Transform failed");
      }
    } catch (error) {
      console.error("Transform error:", error);
      alert("🚫 Error during transformation");
    } finally {
      setLoading(false);
    }
  }, [platform, setTransformed]);

  const handleValidation = useCallback(async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:9090/validate', {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.text();
        console.log("Validation Result:", result);
        setSuccess(true);
      } else {
        alert("❌ Validation failed.");
      }
    } catch (err) {
      console.error("Validation error:", err);
      alert("🚫 Backend error during validation.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:9090/refresh', {
        method: 'GET',
      });

      if (response.ok) {
        alert('✅ Local files deleted successfully.');
        setFileUploaded(false);
        setLoadedToDB(false);
        setTransformed(false);
        setSelectedFile(null);
        setPlatform('');
      } else {
        alert('❌ Refresh failed.');
      }
    } catch (error) {
      console.error('Refresh error:', error);
      alert('🚫 Error deleting local files.');
    }
  }, [setFileUploaded, setLoadedToDB, setTransformed]);

  useEffect(() => {
    if (action === 'validate') {
      handleValidation();
    }
  }, [action, handleValidation]);

  useEffect(() => {
    if (action === 'refresh') {
      handleRefresh();
    }
  }, [action, handleRefresh]);

  return (
    <div className="content_display">
      {action === 'source' && <VideoSection />}

      {action === 'extract' && (
        <ExtractSection selectedFile={selectedFile} handleFileChange={handleFileChange} />
      )}

      {action === 'load' && (
        <LoadSection
          loading={loading}
          success={success}
          selectedFile={selectedFile}
          onLoadMongo={handleLoadToMongo}
          onLoadDB2={handleLoadToDB2}
        />
      )}

      {action === 'transform' && (
        <TransformSection
          setLoading={setLoading}
          setSuccess={setSuccess}
          setTransformOutput={setTransformOutput}
        />
      )}

      {action === 'mapping' && (
        <Mapping />
      )}

      {action === 'refresh' && (
        <RefreshSection
          setFileUploaded={setFileUploaded}
          setLoadedToDB={setLoadedToDB}
          setTransformed={setTransformed}
        />
      )}

      {action === 'validate' && (
        <ValidateSection loading={loading} success={success} />
      )}
    </div>
  );
}

export default Container;
