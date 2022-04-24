import React, { Component } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../utils/getWeb3";

import "./App.css";

import Header from "../components/header/Header";
import Input from "../components/input/Input";

class App extends Component {
  state = {
    web3: null, 
    accounts: { connected: null, owner: null, isOwner: null}, 
    contract: null,
    status: { value: null, func: null },
    admin: { value: null, func: null },
    voters: [],
    proposals: []
  }

  updateStatus = (value) => {
    this.setState({status:{value}})
    console.debug('Status Updated')
  }

  updateAdmin = () => {
    this.setState({admin: 
      { value: !this.state.admin.value, func: this.updateAdmin}
    });
    console.debug(`Admin Dashbord: ${!this.state.admin.value}`);
  }

  updateVoters = async () => {
    const events = this.state.contract
      .getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: 'latest'})
    
    console.log(events);
  }

  addVoter = async (address) => {
    await this.state.contract.methods.addVoter(address)
      .send({from: this.state.accounts.connected})
      .then((res) =>{
        console.log(res)
        const voters = [...this.state.voters, 
          res.events.VoterRegistered.returnValues.voterAddress];
        console.log(voters);
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

      //t: Get status Worklow
      const status = await instance.methods.workflowStatus().call();

      //t: Get owner
      const owner = await instance.methods.owner().call();

      //t: Get voters
      const voters = await instance
        .getPastEvents('VoterRegistered', { fromBlock: 0, toBlock: 'latest'})
      
      const arrayVoters = voters.map(element => element.returnValues.voterAddress);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ 
        web3,
        accounts: {connected: accounts[0], owner, isOwner: accounts[0] == owner}, 
        contract: instance, 
        status:{value: status, func: this.updateStatus},
        admin:{value: false, func: this.updateAdmin},
        voters: arrayVoters
      });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
    }
  };

  componentDidUpdate = async () => {
    window.ethereum.on('accountsChanged', async () =>{
      const accounts = await this.state.web3.eth.getAccounts();
      this.setState({
        accounts: { 
          connected: accounts[0],
          owner: this.state.accounts.owner,
          isOwner: accounts == this.state.accounts.owner},
        admin: {value: false, func: this.updateAdmin}
      });
    })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Header
          accounts={this.state.accounts}
          contract={this.state.contract}
          status={this.state.status}
          admin={this.state.admin}
        />
        <Input
          addVoter={this.addVoter}
          admin={this.state.admin}
        />
      </div>

    );
  }
}

export default App;
