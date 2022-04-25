import React, { Component } from "react";

import './Getters.css'

class Getters extends Component{
	state = {
		voterAddres: '',
		voterData: '',
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

	
	render() {
		return (
			<div id="Getters">
				{this.getVoterInput()}
			</div>
		)
	}
}

export default Getters;