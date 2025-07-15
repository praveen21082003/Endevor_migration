import './App.css';
import Button from './Components/Button';
import Container from './Components/Container';
import { useState } from 'react';

function App() {
  const [selectedAction, setSelectedAction] = useState('');

  // State to track process flow
  const [fileUploaded, setFileUploaded] = useState(false);
  const [loadedToDB, setLoadedToDB] = useState(false);
  const [transformed, setTransformed] = useState(false);

  const handleAction = (action) => {
    // Restrict next step if previous not done
    if (action === 'load' && !fileUploaded) {
      alert('⚠️ Please upload a file first (Endeavor Extract).');
      return;
    }
    if (action === 'transform' && !loadedToDB) {
      alert('⚠️ Please load to database first.');
      return;
    }

    setSelectedAction(action);
  };

  return (
    <>
      <header className="heading">
        <h1 className="heading_style">zMigGIT</h1>
      </header>

      <div className="btnsandcontainer">
        <div className="Btns_container">
          {[
            ['SCM Source', 'source'],
            ['Endeavor Extract', 'extract'],
            ['Load DB', 'load'],
            ['Transform', 'transform'],
            ['Mapping', 'mapping'],
            ['Refresh', 'refresh'],
            ['Validate & Report', 'validate']
          ].map(([label, key]) => (
            <div className="btn_with_arrow" key={key}>
              <Button label={label} onClick={() => handleAction(key)} active={selectedAction === key} />
              {selectedAction === key && <span className="arrow_mark">⭢</span>}
            </div>
          ))}
        </div>

        {selectedAction ? (
          <Container
            action={selectedAction}
            fileUploaded={fileUploaded}
            setFileUploaded={setFileUploaded}
            loadedToDB={loadedToDB}
            setLoadedToDB={setLoadedToDB}
            transformed={transformed}
            setTransformed={setTransformed}
          />
        ) : (
          <div className="welcome_message">
            <h2>Welcome to zMigGIT</h2>
            <p>Please select an action to get started.</p>
          </div>
        )}
      </div>

      <footer className="footer">
        <p>© 2025 zMigGIT. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
