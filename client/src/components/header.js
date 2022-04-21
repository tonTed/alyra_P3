import React, { Component } from "react";
import VotingContract from "../contracts/Voting.json";

import "./components.css";

const status = {
	0: "Registration Voters",
	1: "Proposals session"
}

class Header extends Component {

	constructor(props){
		super(props);
		this.state = {admin: this.props.admin};
		console.log(this.props.contract); 
	}
	
	switchAdmin = (status) => {
		this.setState({admin: status});
		this.props.funcAdmin(status);
		console.log("switch " + this.state.admin, this.props.admin, status);

	}
	
	adminButton = () => {
		if (this.state.admin)
			return (
				<div className="admin-button">
					<button onClick={() => this.switchAdmin(null)}>Admin Dasboard</button>
					{/* <button onClick={() => this.switchAdmin(null)}>Admin Dasboard</button> */}
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

	forwardFlow = async () => {
		const result1 = await this.props.contract.methods.workflowStatus().call();
		console.log(result1);
		const result = await this.props.contract.methods.startProposalsRegistering().send({from: this.props.owner})
		console.log(result);
		const result2 = await this.props.contract.methods.workflowStatus().call();
		console.log(result2);
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
				<p>{this.props.status} : {status[this.props.status]}</p>
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