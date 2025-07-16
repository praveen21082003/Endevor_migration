import './styles/validate.css';

function ValidateSection({ loading, success }) {
  return (
    <div className="load_section">
      {loading ? (
        <>
          <div className="spinner"></div>
          <p className="loading_text"> Generating report files...</p>
        </>
      ) : success ? (
        <>
          
          <a
            href="http://localhost:9090/reports/filesize"
            target="_blank"
            rel="noopener noreferrer"
            className="report_link"
          >
            ➡ 📄 <h3>Validate FilesSize</h3>
          </a>
          
          

          <br />
          
          <a
            href="http://localhost:9090/reports/filecount"
            target="_blank"
            rel="noopener noreferrer"
            className="report_link"
          >
            ➡ 📄 <h3>Validate FilesCount</h3>
          </a>
          
          
        </>
      ) : (
        <p className="waiting_text">⚠️ No validation in progress or not triggered.</p>
      )}
    </div>
  );
}

export default ValidateSection;
