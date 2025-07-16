import { useState } from 'react';
import './styles/transform.css';

function TransformSection({ setLoading, setSuccess, setTransformOutput }) {
  const [targetPlatform, setTargetPlatform] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState('');
  const [progress, setProgress] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const [successState, setSuccessState] = useState(false);
  const [backendMessage, setBackendMessage] = useState('');

  const handleSubmit = async () => {
    console.log("Submit clicked"); // ✅ Debug
    console.log("Source:", sourcePlatform);
    console.log("Target:", targetPlatform);

    if (sourcePlatform === "" || targetPlatform === "") {
      alert("⚠️ Please select both Source and Target platforms.");
      return;
    }

    // Proceed only if valid
    setLoading(true);
    setLoadingState(true);
    setSuccess(false);
    setSuccessState(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(interval);
        }
        return next;
      });
    }, 200);

    const payload = {
      sourcePlatform: sourcePlatform,
      platform: targetPlatform,
      type: "target",
    };

    try {
      const response = await fetch("http://localhost:9090/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      setTransformOutput(result);
      setBackendMessage(result);

      if (response.ok && result.toLowerCase().includes("success")) {
        setSuccess(true);
        setSuccessState(true);
      } else {
        alert("⚠️ Transform ran but may not be successful.");
      }
    } catch (error) {
      console.error("Transform error:", error);
      alert("🚫 Error during transformation");
    } finally {
      clearInterval(interval);
      setProgress(100);
      setLoading(false);
      setLoadingState(false);
    }
  };


  return (
    <div className="load_section">
      {loadingState ? (
        <>
          <div className="progress_wrapper">
            <div className="progress_bar" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="loading_text">
            Transforming from {sourcePlatform} to {targetPlatform}... ({progress}%)
          </p>
        </>
      ) : successState ? (
        <p className="success_text">✅ {backendMessage}</p>
      ) : (
        <>
          <div className="select_wrapper">
            <div>
              <select
                className="select_bar"
                value={sourcePlatform}
                onChange={(e) => setSourcePlatform(e.target.value)}
              >
                <option value="">-- SOURCE --</option>
                <option value="endevor">ENDEVOR</option>
                <option value="changeman">CHANGEMAN</option>
              </select>
            </div>
            <div>
              <select
                className="select_bar"
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
              >
                <option value="">-- TARGET --</option>
                <option value="GITHUB">GITHUB</option>
                <option value="GITLAB">GITLAB</option>
                <option value="Bitbucket">BitBucket</option>
                <option value="Azure_DevOps">Azure DevOps</option>
              </select>
            </div>
          </div>
          <button
            className="transformbtns"
            onClick={handleSubmit}
            disabled={loadingState}
          >
            Transform from {sourcePlatform || '...'} to {targetPlatform || '...'}
          </button>
        </>
      )}
    </div>
  );
}

export default TransformSection;
