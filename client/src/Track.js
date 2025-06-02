import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import { QRCodeCanvas } from 'qrcode.react';
import './Track.css'; // Import custom CSS

function Track() {
    const history = useHistory();
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, []);

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState();
    const [MedStage, setMedStage] = useState();
    const [ID, setID] = useState();
    const [RMS, setRMS] = useState();
    const [MAN, setMAN] = useState();
    const [DIS, setDIS] = useState();
    const [RET, setRET] = useState();
    const [TrackTillSold, showTrackTillSold] = useState(false);
    const [TrackTillRetail, showTrackTillRetail] = useState(false);
    const [TrackTillDistribution, showTrackTillDistribution] = useState(false);
    const [TrackTillManufacture, showTrackTillManufacture] = useState(false);
    const [TrackTillRMS, showTrackTillRMS] = useState(false);
    const [TrackTillOrdered, showTrackTillOrdered] = useState(false);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
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
                med[i + 1] = await supplychain.methods.MedicineStock(i + 1).call();
                medStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
            }
            setMED(med);
            setMedStage(medStage);
            const rmsCtr = await supplychain.methods.rmsCtr().call();
            const rms = {};
            for (let i = 0; i < rmsCtr; i++) {
                rms[i + 1] = await supplychain.methods.RMS(i + 1).call();
            }
            setRMS(rms);
            const manCtr = await supplychain.methods.manCtr().call();
            const man = {};
            for (let i = 0; i < manCtr; i++) {
                man[i + 1] = await supplychain.methods.MAN(i + 1).call();
            }
            setMAN(man);
            const disCtr = await supplychain.methods.disCtr().call();
            const dis = {};
            for (let i = 0; i < disCtr; i++) {
                dis[i + 1] = await supplychain.methods.DIS(i + 1).call();
            }
            setDIS(dis);
            const retCtr = await supplychain.methods.retCtr().call();
            const ret = {};
            for (let i = 0; i < retCtr; i++) {
                ret[i + 1] = await supplychain.methods.RET(i + 1).call();
            }
            setRET(ret);
            setloader(false);
        } else {
            window.alert('The smart contract is not deployed to current network');
        }
    };

    const handlerChangeID = (event) => {
        setID(event.target.value);
    };

    const redirect_to_home = () => {
        history.push('/');
    };

    const handlerSubmit = async (event) => {
        event.preventDefault();
        const ctr = await SupplyChain.methods.medicineCtr().call();
        if (!(ID > 0 && ID <= ctr)) {
            alert("Invalid Battery ID!!!");
        } else {
            switch (MED[ID].stage) {
                case 5:
                    showTrackTillSold(true);
                    break;
                case 4:
                    showTrackTillRetail(true);
                    break;
                case 3:
                    showTrackTillDistribution(true);
                    break;
                case 2:
                    showTrackTillManufacture(true);
                    break;
                case 1:
                    showTrackTillRMS(true);
                    break;
                default:
                    showTrackTillOrdered(true);
            }
        }
    };

    const renderTrackStage = (stageComponents) => (
        <div className="container-xl py-5">
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h3 className="card-title text-primary mb-3"><u>Battery Details</u></h3>
                    <p><strong>Battery ID:</strong> {MED[ID].id}</p>
                    <p><strong>Name:</strong> {MED[ID].name}</p>
                    <p><strong>Description:</strong> {MED[ID].description}</p>
                    <p><strong>Current Stage:</strong> {MedStage[ID]}</p>
                </div>
            </div>
            <div className="row g-4">
                {stageComponents.map((stage, index) => (
                    <React.Fragment key={index}>
                        <div className="col-md-3">
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h4 className="card-title text-secondary"><u>{stage.title}</u></h4>
                                    <p><strong>ID:</strong> {stage.data.id}</p>
                                    <p><strong>Name:</strong> {stage.data.name}</p>
                                    <p><strong>Place:</strong> {stage.data.place}</p>
                                </div>
                            </div>
                        </div>
                        {index < stageComponents.length - 1 && (
                            <div className="col-md-1 d-flex align-items-center justify-content-center">
                                <span className="text-primary fs-3">➔</span>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className="d-flex gap-2 mt-4">
                <button className="btn btn-outline-primary" onClick={() => {
                    showTrackTillSold(false);
                    showTrackTillRetail(false);
                    showTrackTillDistribution(false);
                    showTrackTillManufacture(false);
                    showTrackTillRMS(false);
                    showTrackTillOrdered(false);
                }}>Track Another Item</button>
                <button className="btn btn-outline-danger" onClick={redirect_to_home}>Home</button>
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

    if (TrackTillSold) {
        return renderTrackStage([
            { title: "Raw Materials Supplied by", data: RMS[MED[ID].RMSid] },
            { title: "Manufactured by", data: MAN[MED[ID].MANid] },
            { title: "Distributed by", data: DIS[MED[ID].DISid] },
            { title: "Retailed by", data: RET[MED[ID].RETid] },
            { title: "Sold", data: {} }
        ]);
    }

    if (TrackTillRetail) {
        return renderTrackStage([
            { title: "Raw Materials Supplied by", data: RMS[MED[ID].RMSid] },
            { title: "Manufactured by", data: MAN[MED[ID].MANid] },
            { title: "Distributed by", data: DIS[MED[ID].DISid] },
            { title: "Retailed by", data: RET[MED[ID].RETid] }
        ]);
    }

    if (TrackTillDistribution) {
        return renderTrackStage([
            { title: "Raw Materials Supplied by", data: RMS[MED[ID].RMSid] },
            { title: "Manufactured by", data: MAN[MED[ID].MANid] },
            { title: "Distributed by", data: DIS[MED[ID].DISid] }
        ]);
    }

    if (TrackTillManufacture) {
        return renderTrackStage([
            { title: "Raw Materials Supplied by", data: RMS[MED[ID].RMSid] },
            { title: "Manufactured by", data: MAN[MED[ID].MANid] }
        ]);
    }

    if (TrackTillRMS) {
        return renderTrackStage([
            { title: "Raw Materials Supplied by", data: RMS[MED[ID].RMSid] }
        ]);
    }

    if (TrackTillOrdered) {
        const batteryData = {
            id: MED[ID]?.id,
            name: MED[ID]?.name,
            description: MED[ID]?.description,
            currentStage: MedStage[ID]
        };
        const batteryDataString = JSON.stringify(batteryData);

        return (
            <div className="container-xl py-5">
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h3 className="card-title text-primary mb-3"><u>Battery Details</u></h3>
                        <p><strong>Battery ID:</strong> {MED[ID].id}</p>
                        <p><strong>Name:</strong> {MED[ID].name}</p>
                        <p><strong>Description:</strong> {MED[ID].description}</p>
                        <p><strong>Current Stage:</strong> {MedStage[ID]}</p>
                        <hr />
                        <h5 className="text-muted">Battery Not Yet Processed...</h5>
                    </div>
                </div>
                <div className="card shadow-sm mb-4">
                    <div className="card-body text-center">
                        <h4 className="card-title text-secondary">QR Code</h4>
                        <QRCodeCanvas value={batteryDataString} size={150} />
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary" onClick={() => showTrackTillOrdered(false)}>Track Another Item</button>
                    <button className="btn btn-outline-danger" onClick={redirect_to_home}>Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-xl py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary">Battery Tracking</h2>
                <button className="btn btn-outline-danger" onClick={redirect_to_home}>Home</button>
            </div>
            <p className="mb-4"><strong>Current Account Address:</strong> {currentaccount}</p>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h4 className="card-title text-secondary mb-4">Battery List</h4>
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Battery ID</th>
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
            <div className="card shadow-sm mt-4">
                <div className="card-body">
                    <h5 className="card-title text-secondary">Track a Battery</h5>
                    <form onSubmit={handlerSubmit} className="d-flex gap-2">
                        <input
                            className="form-control"
                            type="text"
                            onChange={handlerChangeID}
                            placeholder="Enter Battery ID"
                            required
                        />
                        <button className="btn btn-primary" type="submit">Track</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Track;