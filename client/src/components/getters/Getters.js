import React, { Component } from "react";

import './Getters.css'

class Getters extends Component{
	state = {
		voterAddres: '',
		voterData: '',
		proposalId: 0,
		proposalData: '',
		winnerId: '',
	}

	getVoter = (e) => {
		e.preventDefault();

		if (!this.props.web3.utils.isAddress(this.state.voterAddres)){
			alert('Bad address');
			this.setState({voterAddres: ""});
			return;
		}

		this.props.contract.methods.getVoter(this.state.voterAddres)
			.call({from: this.props.accounts.connected})
			.then((res) => 
				this.setState({voterData: `Voter (${this.state.voterAddres})\n
				isRegistered: ${res['isRegistered']}\n
				hasVoted: ${res['hasVoted']}\n
				votedProposalId: ${res['votedProposalId']}`}))
			.then(() => this.setState({voterAddres: ""}))
	}

	getVoterInput = () => {
		return (
			<>
				<div><form onSubmit={this.getVoter}>
					<input value={this.state.voterAddres} onChange={(e) =>
						this.setState({voterAddres: e.target.value})} type="text" />
					<input type="submit" value="Get voter" />
				</form></div>
				<div>{this.state.voterData}</div>
			</>
		)
	}

	getProposal = (e) => {
		e.preventDefault();
		this.props.contract.methods.getOneProposal(this.state.proposalId)
			.call({from: this.props.accounts.connected})
			.then((res) => 
				this.setState({proposalData: `id (${this.state.proposalId})\n
				description: ${res['description']}\n
				voteCount: ${res['voteCount']}`}))
	}

	getProposalInput = () => {
		const max = !this.props.proposal.length ? 0 : this.props.proposal.length - 1;
		if (!this.props.proposal.length)
			return(
				<div>
					NO PROPOSAL HAS BEEN MADE YET
				</div>
			)
		return (
			<>
				<div><form onSubmit={this.getProposal}>
					<input 
						value={this.state.proposalId}
						onChange={e => this.setState({proposalId: e.target.value})} 
						type="number"
						min={0}
						max={max}
					/>
					<input type="submit" value="Get proposal" />
				</form></div>
				<div>{this.state.proposalData}</div>
			</>
		)
	}

	getWinner = (e) => {
		e.preventDefault();
		this.props.contract.methods.winningProposalID()
			.call()
			.then((res) => this.setState({winnerId: `${res} : ${this.props.proposal[res]['desc']}`}))
	}

	getWinnerInput = () => {
		return (
			<>
				<div><form onSubmit={this.getWinner}>
					<input type="submit" value="Get Winner" />
				</form></div>
				<div>{this.state.winnerId}</div>
			</>
		)
	}
	
	render() {

		return (
			<div id="Getters">
				{this.getVoterInput()}
				{this.props.status > 0 ? this.getProposalInput() : null}
				{this.props.status == 5 ? this.getWinnerInput() : null}
			</div>
		)
	}
}

export default Getters;