
# Blockchain Supply Chain

A blockchain-based DApp to track products across the supply chain with transparency and security using Ethereum smart contracts.




## Features

- Track products from supplier to consumer.
- Immutable records for trust and verification.
- Role-based access (e.g., Supplier, Manufacturer, Retailer).
- Simple web interface for interaction.


## Tech Stack

- Solidity (smart contracts)
- Truffle (development)
- Ganache (local blockchain)
- Web3.js (frontend)
- MetaMask (transactions)
- Node.js


## Installation

Install Supply Chain Manager with npm:

```bash
  git clone https://github.com/Sanika1710/Supply-Chain-Manager
  cd Supply-Chain-Manager
  npm install
```

Run Ganache:

- Launch Ganache, note the RPC URL (e.g., http://127.0.0.1:7545).

Set Up MetaMask:

- Add Ganache network in MetaMask.
- Import a Ganache account using its private key.





    
## Deployment

To deploy this project run

```bash
  truffle compile
  truffle migrate
```


## Run Locally

Start Frontend:

```bash
  cd client
  npm install
  npm start
```

- Visit http://localhost:3000



## Usage

- Connect MetaMask to the app.
- Add stakeholders and assign roles.
- Register and track products.
- View blockchain records via the interface.


## Contributing
 Fork, make changes, and submit a pull request. Ensure clean, tested code.
