import React, { Component } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../utils/getWeb3";

import "./App.css";
import "../components/Header"
import Header from "../components/Header";
import Body from "../components/Body";

const vars = {
  contract: null,
  owner: null,
  status: null,
  adminStatus: null,
  isVoter: false,
  voters: null,
}

class App extends Component {
  state = {
    web3: null, 
    accounts: null, 
    contract: null,
    owner: null,
    status: null,
    adminStatus: null,
    isVoter: false,
    voters: null,
    vars: vars
  }

  updateAdmin = (e) => {
    this.setState({adminStatus: e});
  }

  updateStatus = (e) => {
    this.setState({status: e})
  }

  isVoter = async () => {
    const eventsVoter = await this.state.contract
    .getPastEvents('VoterRegistered', {fromBlock: 0, toBlock: 'latest'})
    let voters = eventsVoter.map((event) => event['returnValues']['voterAddress'])
    this.setState({voters});
    this.state.voters.forEach(element => {
      if(element == this.state.accounts[0]){
        this.setState({isVoter: true})
        return ;
      }
      this.setState({isVoter: false})
    });
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
      this.setState({vars: {owner, contract: instance, status, owner}})
      console.log("VARS", this.state.vars);
      this.isVoter();

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
      this.isVoter();
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
          isVoter={this.state.isVoter}
          status={this.state.status}
          adminStatus={this.state.adminStatus}
          contract={this.state.contract}
          funcAdmin={this.updateAdmin}
          funcStatus={this.updateStatus}
          vars={this.state.vars}
          />
        <Body
          isVoter={this.state.isVoter}
          adminStatus={this.state.adminStatus}
          account={this.state.accounts[0]}
          contract={this.state.contract}
          status={this.state.status}
        />
      </div>

    );
  }
}

export default App;
