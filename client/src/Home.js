import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Home.css';

function Home() {
  const history = useHistory();
  const [clicked, setClicked] = useState(false);

  const redirectTo = (path) => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
      history.push(path);
    }, 500);
  };

  return (
    <div className="home-container">
      <div className="card home-content">
        <div className="card-body text-center">
          <h1 className="card-title mb-4">Supply Chain Manager</h1>
          <div className="button-group">
            <button
              className={`btn fancy-button ${clicked ? 'burst' : ''}`}
              onClick={() => redirectTo('/roles')}
            >
              Register Roles
            </button>
            <button
              className={`btn fancy-button ${clicked ? 'burst' : ''}`}
              onClick={() => redirectTo('/addmed')}
            >
              Order Materials
            </button>
            <button
              className={`btn fancy-button ${clicked ? 'burst' : ''}`}
              onClick={() => redirectTo('/track')}
            >
              Track Materials
            </button>
            <button
              className={`btn fancy-button ${clicked ? 'burst' : ''}`}
              onClick={() => redirectTo('/supply')}
            >
              Supply Materials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;