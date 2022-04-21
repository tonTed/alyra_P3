import React, { Component } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../utils/getWeb3";

import "./App.css";
import "../components/Header"
import Header from "../components/Header";
import Body from "../components/Body";

class App extends Component {
  state = {
    web3: null, 
    accounts: null, 
    contract: null,
    owner: null,
    status: null,
    admin: null,
  }

  updateAdmin = (e) => {
    this.setState({admin: e});
    console.log("\n\n");
    console.log("this.state.admin: ", this.state.admin);
    console.log("-------------- e: ", e);
    console.log("\n\n");
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
      
      //t: Get the owner of the contract
      const owner = await instance.methods.owner().call();
      //t: Get the status of the contract
      const status = await instance.methods.workflowStatus().call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, owner, status});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    }
  };

  componentDidUpdate = async () => {
    //t: Change state on change account in metamask
    window.ethereum.on('accountsChanged', async () =>{
      const accounts = await this.state.web3.eth.getAccounts();
      this.setState({accounts});
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Header 
          account={this.state.accounts[0]}
          owner={this.state.owner}
          status={this.state.status}
          admin={this.state.admin}
          funcAdmin={this.updateAdmin}
          contract={this.state.contract}
        />
        <Body
        />
      </div>

    );
  }
}

export default App;
