module.exports = {
  contracts_build_directory: './client/src/artifacts',
  networks: {
    development: {
      host: "127.0.0.1",     
      port: 7545,         
      network_id: "5777",      
    },
  },
  db: {
    enabled: false
  }
};
