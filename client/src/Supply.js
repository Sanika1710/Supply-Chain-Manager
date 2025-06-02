import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';
import SupplyChainABI from './artifacts/SupplyChain.json';
import './Supply.css';

function Supply() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState('');
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState({});
  const [MedStage, setMedStage] = useState([]);
  const [ID, setID] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      setToast({ show: true, message: 'Non-Ethereum browser detected. You should consider trying MetaMask!' });
    }
  };

  const loadBlockchaindata = async () => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);
    const networkId = await web3.eth.net.getId();
    const networkData = SupplyChainABI.networks[networkId];
    if (networkData) {
      const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
      setSupplyChain(supplychain);
      const medCtr = await supplychain.methods.medicineCtr().call();
      const med = {};
      const medStage = [];
      for (let i = 0; i < medCtr; i++) {
        med[i] = await supplychain.methods.MedicineStock(i + 1).call();
        medStage[i] = await supplychain.methods.showStage(i + 1).call();
      }
      setMED(med);
      setMedStage(medStage);
      setloader(false);
    } else {
      setToast({ show: true, message: 'The smart contract is not deployed to the current network' });
    }
  };

  const redirect_to_home = () => {
    history.push('/');
  };

  const handlerChangeID = (event) => {
    setID(event.target.value);
  };

  const handleSubmit = (method) => async (event) => {
    event.preventDefault();
    try {
      const receipt = await SupplyChain.methods[method](ID).send({ from: currentaccount });
      if (receipt) {
        loadBlockchaindata();
        setToast({ show: true, message: `Successfully processed ${method} for Medicine ID ${ID}` });
      }
    } catch (err) {
      setToast({ show: true, message: 'An error occurred. Please check the Medicine ID or your permissions.' });
    }
  };

  const SupplyStepForm = ({ step, title, method, description }) => (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title text-secondary">{`Step ${step}: ${title}`}</h5>
        <p className="text-muted mb-3">{description}</p>
        <form onSubmit={handleSubmit(method)} className="d-flex gap-2">
          <input
            className="form-control"
            type="text"
            onChange={handlerChangeID}
            placeholder="Enter Medicine ID"
            required
          />
          <button className="btn btn-primary" type="submit">{title}</button>
        </form>
      </div>
    </div>
  );

  if (loader) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl py-5">
      <header className="mb-4">
        <h1 className="text-primary text-center">Supply Chain Management</h1>
      </header>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="mb-0"><strong>Current Account Address:</strong> {currentaccount}</p>
        <button className="btn btn-outline-danger" onClick={redirect_to_home}>Home</button>
      </div>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title text-secondary mb-3">Supply Chain Flow</h4>
          <p className="text-muted">
            Medicine Order → Raw Material Supplier → Manufacturer → Distributor → Retailer → Consumer
          </p>
        </div>
      </div>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title text-secondary mb-4">Medicine List</h4>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">Medicine ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Current Processing Stage</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(MED).map((key) => (
                  <tr key={key}>
                    <td>{MED[key].id}</td>
                    <td>{MED[key].name}</td>
                    <td>{MED[key].description}</td>
                    <td>{MedStage[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <SupplyStepForm
        step="1"
        title="Supply Raw Materials"
        method="RMSsupply"
        description="Only a registered Raw Material Supplier can perform this step."
      />
      <SupplyStepForm
        step="2"
        title="Manufacture"
        method="Manufacturing"
        description="Only a registered Manufacturer can perform this step."
      />
      <SupplyStepForm
        step="3"
        title="Distribute"
        method="Distribute"
        description="Only a registered Distributor can perform this step."
      />
      <SupplyStepForm
        step="4"
        title="Retail"
        method="Retail"
        description="Only a registered Retailer can perform this step."
      />
      <SupplyStepForm
        step="5"
        title="Mark as Sold"
        method="sold"
        description="Only a registered Retailer can perform this step."
      />
      <div className={`toast align-items-center ${toast.show ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true" style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <div className="d-flex">
          <div className="toast-body">{toast.message}</div>
          <button type="button" className="btn-close me-2 m-auto" onClick={() => setToast({ show: false, message: '' })} aria-label="Close"></button>
        </div>
      </div>
    </div>
  );
}

export default Supply;