import React, { Component } from "react";

import "./components.css";

export default class Input extends Component {

	_renderAddVoterInput = () => {
		return (
		<form onSubmit={this.props.addVoter}>
					<label>Voter address: 
						<input type="text" 
							ref={(input) => {this.props.updateInput(input)}}/>
					</label>
					<input type="submit" value="Submit"/>
			</form>
		)
	}

	_renderProposalInput = () => {
		return (
		<form onSubmit={this.props.addProposal}>
					<label>Proposal: 
						<input type="text"
							ref={(input) => {this.props.updateInput(input)}}/>
					</label>
					<input type="submit" value="Submit"/>
			</form>
		)
	}

	_renderVoteInput = () => {
		console.log(this.props.proposals)
		return (
		<form onSubmit={this.props.voteProposal}>
					<label>Proposal id: 
						<input type="number" min={0} max={this.props.proposals.length - 1}
							ref={(input) => {this.props.updateInput(input)}}/>
					</label>
					<input type="submit" value="Vote"/>
			</form>
		)
	}

	renderInput = () => {
		if (this.props.status == 0 && this.props.admin)
			return (<div>{this._renderAddVoterInput()}</div>);
		if (this.props.status == 1 && !this.props.admin)
			return (<div>{this._renderProposalInput()}</div>);
		if (this.props.status == 3 && !this.props.admin)
			return (<div>{this._renderVoteInput()}</div>);
		else
			return (null);
	}

	render() {
		return(this.renderInput());
	}
}