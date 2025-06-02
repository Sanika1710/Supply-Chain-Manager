import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"

function AddMed() {
    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])

    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [MED, setMED] = useState({});
    const [MedName, setMedName] = useState("");
    const [MedDes, setMedDes] = useState("");
    const [MedStage, setMedStage] = useState([]);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
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
            window.alert('The smart contract is not deployed to current network');
        }
    }

    if (loader) {
        return (
            <div style={styles.container}>
                <h1 className="wait">Loading...</h1>
            </div>
        )
    }

    const redirect_to_home = () => {
        history.push('/')
    }

    const handlerChangeNameMED = (event) => {
        setMedName(event.target.value);
    }

    const handlerChangeDesMED = (event) => {
        setMedDes(event.target.value);
    }

    const handlerSubmitMED = async (event) => {
        event.preventDefault();
        try {
            const reciept = await SupplyChain.methods.addMedicine(MedName, MedDes).send({ from: currentaccount });
            if (reciept) {
                loadBlockchaindata();
            }
        } catch (err) {
            alert("An error occurred");
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <div style={styles.header}>
                    <span><b>Current Account Address:</b> {currentaccount}</span>
                    <span onClick={redirect_to_home} className="btn btn-outline-danger btn-sm" style={styles.homeButton}>HOME</span>
                </div>
                <br />
                <h5>Add Battery Order:</h5>
                <form onSubmit={handlerSubmitMED} style={styles.form}>
                    <input className="form-control-sm" type="text" onChange={handlerChangeNameMED} placeholder="Battery Name" required />
                    <input className="form-control-sm" type="text" onChange={handlerChangeDesMED} placeholder="Battery Description" required />
                    <button className="btn btn-outline-success btn-sm" style={styles.submitButton}>Order</button>
                </form>
                <br />
                <h5>Ordered Batteries:</h5>
                <table className="table table-bordered" style={styles.table}>
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Current Stage</th>
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
    )
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#fef6e4',
        fontFamily: "'Fredoka One', cursive",
        padding: '20px'
    },
    content: {
        backgroundColor: '#fff8dc',
        padding: '2rem',
        borderRadius: '25px',
        border: '6px dashed #ff6b81',
        boxShadow: '8px 8px 0px #000',
        width: '100%',
        maxWidth: '750px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        fontSize: '1rem',
        color: '#000'
    },
    homeButton: {
        padding: '0.4rem 1rem',
        borderRadius: '15px',
        border: '4px solid #000',
        backgroundColor: '#ffa502',
        color: '#fff',
        fontFamily: "'Fredoka One', cursive",
        fontSize: '0.9rem',
        textShadow: '1px 1px #000',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.5rem',
        backgroundColor: '#fff3cd',
        border: '4px dashed #ffa502',
        borderRadius: '20px',
        boxShadow: '4px 4px 0px #000',
        marginBottom: '2rem'
    },
    submitButton: {
        fontFamily: "'Fredoka One', cursive",
        backgroundColor: '#ffa502',
        border: '4px solid #000',
        color: '#fff',
        padding: '0.6rem 1.2rem',
        borderRadius: '15px',
        textShadow: '1px 1px #000',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.3s ease-in-out'
    },
    table: {
        marginTop: '1rem',
        border: '4px solid #ffcf77',
        backgroundColor: '#fff3cd',
        borderRadius: '15px',
        overflow: 'hidden',
        textAlign: 'center'
    }
}


export default AddMed
