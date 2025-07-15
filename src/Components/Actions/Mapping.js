import { useEffect, useState } from 'react';
import './styles/mapping.css';

function Mapping() {
  const [mappingData, setMappingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rawResponse, setRawResponse] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const response = await fetch('http://localhost:9090/mapping');
        const text = await response.text(); // Get raw backend response

        setRawResponse(text); // Show raw backend response to user

        try {
          const json = JSON.parse(text); 
          if (json && typeof json === 'object') {
            setMappingData(json);
          } else {
            setError('Invalid data format received from server.');
          }
        } catch (jsonError) {
          setError('⚠️ Response is not valid JSON. Check backend.');
        }

      } catch (err) {
        setError(`❌ ${err.message || 'Unexpected error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMapping();
  }, []);

  return (
    <div className="mapping_section">
      <h2>📌 Current Migration Mapping</h2>

      {loading ? (
        <p className="loading_text">🔄 Loading mapping...</p>
      ) : error ? (
        <p className="error_text">{error}</p>
      ) : mappingData ? (
        <>
          <table className="mapping_table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(mappingData).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="raw_response">
            <strong>Raw Response:</strong> <code>{rawResponse}</code>
          </p>
        </>
      ) : (
        <p className="empty_text">⚠️ No mapping data found.</p>
      )}
    </div>
  );
}

export default Mapping;
