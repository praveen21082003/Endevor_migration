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
    if (!sourcePlatform || !targetPlatform) {
      alert("⚠️ Please select both Source and Target platforms.");
      return;
    }

    setLoading(true);
    setLoadingState(true);
    setSuccess(false);
    setSuccessState(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next >= 90) {
          clearInterval(interval);
        }
        return next;
      });
    }, 300);

    const payload = {
      source: sourcePlatform,
      target: targetPlatform,
    };

    try {
      const response = await fetch("http://localhost:9090/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.text();
        setTransformOutput(result);
        setBackendMessage(result);
        setSuccess(true);
        setSuccessState(true);
      } else {
        alert("❌ Transform failed");
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
        <p className="success_text"> {backendMessage}</p>
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
                <option value="Endevor">ENDEVOR</option>
                <option value="Changeman">CHANGEMAN</option>
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
            disabled={!sourcePlatform || !targetPlatform}
          >
            Transform from {sourcePlatform || '...'} to {targetPlatform || '...'}
          </button>
        </>
      )}
    </div>
  );
}

export default TransformSection;
