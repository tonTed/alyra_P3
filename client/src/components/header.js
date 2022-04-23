import React, { Component } from "react";
import VotingContract from "../contracts/Voting.json";

import "./components.css";

const status = [
	{name: "Registration Voters",					func: `this.props.contract.methods.startProposalsRegistering()`},
	{name: "Proposals Registering", 			func: `this.props.contract.methods.endProposalsRegistering()`},
	{name: "Proposals Registering Ended", func: `this.props.contract.methods.startVotingSession()`},
	{name: "Voting Session", 							func: `this.props.contract.methods.endVotingSession()`},
	{name: "Voting Session Ended", 				func: `this.props.contract.methods.tallyVotes()`},
]

class Header extends Component {

	constructor(props){
		super(props);
		this.state = {admin: this.props.admin};
	}
	
	switchAdmin = (status) => {
		this.setState({admin: status});
		this.props.funcAdmin(status);
	}
	
	adminButton = () => {
		if (this.state.admin)
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

	addressRender = () => {
		return (
			<div id="address" style={{ position: "relative"}}>
				<p style={{float: "left"}}>{this.props.account}</p>
				{this.props.account === this.props.owner ? this.adminButton() : null}
			</div>
		)
	}

	forwardFlow = () => {
		eval(status[this.props.status].func)
			.send({from: this.props.account})
			.then((res) => {
					this.props.funcStatus(res.events.WorkflowStatusChange.returnValues.newStatus);
				});
	} 

	adminFlow = () => {
		return (
			<div className="admin-button">
				<button onClick={this.forwardFlow}>Next Status</button>
			</div>
		);

	}
	
	statusRender = () => {
		return (
			<div id="status" style={{ position: "relative"}}>
				<p>{this.props.status} : {status[this.props.status].name}</p>
				{this.props.account && this.props.admin ? this.adminFlow() : null}
			</div>
		)
	}
	
	render() {
		return (
			<div id="header">
				{this.statusRender()}
				{this.addressRender()}
			</div>
		)
	}
}

export default Header;