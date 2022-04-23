import React, { Component } from "react";

import "./components.css";
import Utils from "./Utils";

const utils = new Utils()

const status = [
	{name: "Registration Voters",					func: `this.props.contract.methods.startProposalsRegistering()`},
	{name: "Proposals Registering", 			func: `this.props.contract.methods.endProposalsRegistering()`},
	{name: "Proposals Registering Ended", func: `this.props.contract.methods.startVotingSession()`},
	{name: "Voting Session", 							func: `this.props.contract.methods.endVotingSession()`},
	{name: "Voting Session Ended", 				func: `this.props.contract.methods.tallyVotes()`},
	{name: "Votes Tallied", 							func: null},
]

class Header extends Component {
	
	switchAdmin = (status) => {
		this.props.funcAdmin(status);
	}
	
	adminButton = () => {
		if (this.props.adminStatus)
			return (
				<div className="admin-button">
					<button onClick={() => this.switchAdmin(null)}>Admin Dasboard</button>
				</div>
				);
		else
			return (
				<div className="admin-button">
					<button onClick={() => this.switchAdmin(1)}>Admin</button>
				</div>);
	}

	forwardFlow = () => {
		eval(status[this.props.status].func)
			.send({from: this.props.account})
			.then((res) => {
					this.props.funcStatus(res.events.WorkflowStatusChange.returnValues.newStatus);
				});
	} 

	renderAddress = () => {
		return (
			<div id="address" style={{ position: "relative"}}>
				<p style={{float: "left"}}>{this.props.account}</p>
				{utils.isOwner(this.props.account, this.props.owner) ? this.adminButton() : null}
			</div>
		)
	}

	renderFlowButton = () => {
		return (
			<div className="admin-button">
				<button onClick={this.forwardFlow}>Next Status</button>
			</div>
		);

	}
	
	renderStatus = () => {
		return (
			<div id="status" style={{ position: "relative"}}>
				<p>{this.props.status} : {status[this.props.status].name}</p>
				{this.props.account && this.props.adminStatus ? this.renderFlowButton() : null}
			</div>
		)
	}
	
	render() {
		console.log(this.props.vars);
		return (
			<div id="header">
				{this.renderStatus()}
				{this.renderAddress()}
			</div>
		)
	}
}

export default Header;