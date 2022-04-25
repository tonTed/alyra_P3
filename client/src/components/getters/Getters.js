import React, { Component } from "react";

import './Getters.css'

class Getters extends Component{
	state = {
		voterAddres: '',
		voterData: '',
		proposalId: 0,
		proposalData: '',
	}

	getVoter = (e) => {
		e.preventDefault();
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
		return (
			<>
				<div><form onSubmit={this.getProposal}>
					<input 
						value={this.state.proposalId}
						onChange={e => this.setState({proposalId: e.target.value})} 
						type="number"
						min={0}
						max={this.props.proposalAmount - 1}
					/>
					<input type="submit" value="Get proposal" />
				</form></div>
				<div>{this.state.proposalData}</div>
			</>
		)
	}
	
	render() {
		return (
			<div id="Getters">
				{this.getVoterInput()}
				{this.getProposalInput()}
			</div>
		)
	}
}

export default Getters;