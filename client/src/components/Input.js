import React, { Component } from "react";
import VotingContract from "../contracts/Voting.json";

import "./components.css";
import Utils from "./test";

const utils = new Utils()

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

	renderInput = () => {
		if (this.props.status == 0 && this.props.admin)
			return (<div>{this._renderAddVoterInput()}</div>);
		if (this.props.status == 1)
			return (<div>{this._renderProposalInput()}</div>);
		if (this.props.status == 3)
			return (<div>{this._renderVoteInput()}</div>);
		else
			return (null);
	}

	render() {
		return(this.renderInput());
	}
}