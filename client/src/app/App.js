import React, { Component } from "react";
import VotingContract from "../contracts/Voting.json";
import getWeb3 from "../utils/getWeb3";

import "./App.css";

import Header from "../components/header/Header";
import Input from "../components/input/Input";
import Message from "../components/message/Message";
import Proposals from "../components/proposals/Proposals";
import Getters from "../components/getters/Getters";

class App extends Component {
	state = {
		web3: null, 
		accounts: { connected: null, owner: null, isOwner: null, isVoter: null}, 
		contract: null,
		status: { value: null, func: null },
		admin: { value: null, func: null },
		voters: [],
		proposals: []
	}

	updateStatus = (value) => {
		this.setState({status:{value, func: this.updateStatus}})
		console.debug('Status Updated')
	}

	updateAdmin = () => {
		this.setState({admin: 
			{ value: !this.state.admin.value, func: this.updateAdmin}
		});
		console.debug(`Admin Dashbord: ${!this.state.admin.value}`);
	}

	isVoter = (address) => {
		let ret = false;
		this.state.voters.forEach((element) =>
			address == element ? ret = true : null);
		return (ret);
	}

	addVoter = async (address) => {
		await this.state.contract.methods.addVoter(address)
			.send({from: this.state.accounts.connected})
			.then((res) =>{
				const voters = [...this.state.voters, 
					res.events.VoterRegistered.returnValues.voterAddress];
				this.setState({voters})
				console.debug(`Voter ${address} added`);
				alert(`Voter ${address} added`);
			});
	}

	addProposal = async (proposal) => {
		await this.state.contract.methods.addProposal(proposal)
			.send({from: this.state.accounts.connected})
			.then(() => {
				this.setState({proposals: [...this.state.proposals, 
					{'desc': proposal, 'count': 0}]})
				})
		console.debug(`Proposal ${proposal} added`);
		alert(`Proposal ${proposal} added`);
	}

	getProposals = async (instance, len) => {
		let array = [];
		let ret = [];
		let tmp;
		for (let i = 0; i < len; i++){
			try {
				tmp = await instance.methods.proposalsArray(i).call();
				array.push(tmp);
			} catch {
				break ;
			}
		}
		array.forEach((e) => ret.push({'desc': e['description'], 'count': e['voteCount']}))
		return (ret);
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
			this.setState({voters: arrayVoters});
			
			//t: Get Proposals
			const eventsProposals = await instance
				.getPastEvents('ProposalRegistered', { fromBlock: 0, toBlock: 'latest'})
			const proposals = await this.getProposals(instance, eventsProposals.length);
			
			// Set web3, accounts, and contract to the state, and then proceed with an
			// example of interacting with the contract's methods.
			this.setState({ 
				web3,
				accounts: {
					connected: accounts[0],
					owner: owner, 
					isOwner: accounts[0] == owner,
					isVoter: this.isVoter(accounts[0])}, 
				contract: instance, 
				status:{value: status, func: this.updateStatus},
				admin:{value: false, func: this.updateAdmin},
				proposals: proposals,
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
					isOwner: accounts == this.state.accounts.owner,
					isVoter: this.isVoter(accounts[0])},
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
				{!this.state.admin.value
					? <Message
						accounts={this.state.accounts}
						status={this.state.status.value}/>
					: null}
				<Input
					accounts={this.state.accounts}
					addVoter={this.addVoter}
					addProposal={this.addProposal}
					admin={this.state.admin}
					status={this.state.status.value}
					contract={this.state.contract}
					proposalAmount={this.state.proposals.length}
					proposals={this.state.proposals}
				/>
				{this.state.accounts.isVoter
				? <Getters
					proposalAmount={this.state.proposals.length}
					status={this.state.status.value}
					contract={this.state.contract}
					accounts={this.state.accounts}
				/>
				: null}
				{this.state.accounts.isVoter 
					&& this.state.status.value >= 1
					&& this.state.status.value < 4
				? <Proposals 
					proposals={this.state.proposals}
				/>
				: null}
			</div>

		);
	}
}

export default App;
