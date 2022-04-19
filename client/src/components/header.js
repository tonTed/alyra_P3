import React, { Component } from "react";
import VotingContract from "../contracts/Voting.json";

import "./components.css";

const status = {
	0: "Registration Voters",
	1: "Proposals session"
}

class Header extends Component {
	
	adminButton = () => {
		return (
			<button onClick={() => console.log("CLICK ADMIN")}>Admin</button>
			)
		}
		
		address = () => {
			return (
				<div id="address" style={{ position: "relative"}}>
					<p style={{float: "left"}}>{this.props.account}</p>
					{this.props.account === this.props.owner ? this.adminButton() : null}
				</div>
		)
	}
	
	status = () => {
		console.log(status[this.props.status]);
		return (
			<div id="address">
				<p>{this.props.status} : {status[this.props.status]}</p>
			</div>
		)
	}
	
	render() {
		console.log(this.props.owner);
		return (
			<div id="header">
				{this.status()}
				{this.address()}
			</div>
		)
	}
}

export default Header;