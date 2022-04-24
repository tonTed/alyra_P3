import React, { Component } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../utils/getWeb3";

import "./App.css";

import Header from "../components/header/Header";

class App extends Component {
  state = {
    web3: null, 
    accounts: null, 
    contract: null,
    status: {
      value: null,
      func: null
    } 
  }

  updateStatus = (value) => {
    this.setState({status:{value}})
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      //t: Set status Worklow
      const status = await instance.methods.workflowStatus().call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, status:{value: status, func: this.updateStatus}});

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    }
  };


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Header
          account={this.state.accounts[0]}
          contract={this.state.contract}
          status={this.state.status}
        /> 
      </div>

    );
  }
}

export default App;
