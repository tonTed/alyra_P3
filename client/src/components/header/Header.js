import React, { Component, useState } from "react";
import "./Header.css"

const status = [
	{name: "Registration Voters",					func: `this.props.contract.methods.startProposalsRegistering()`},
	{name: "Proposals Registering", 			func: `this.props.contract.methods.endProposalsRegistering()`},
	{name: "Proposals Registering Ended", func: `this.props.contract.methods.startVotingSession()`},
	{name: "Voting Session", 							func: `this.props.contract.methods.endVotingSession()`},
	{name: "Voting Session Ended", 				func: `this.props.contract.methods.tallyVotes()`},
	{name: "Votes Tallied", 							func: null},
]

function Worklow(props) {
	const _status = props.status.value;
		return (
			<div className="Workflow">
				<p>{`${_status}: ${status[_status].name}`}</p>
			</div>
		)
}

function Address(props) {
	return (
		<div className="Address">
			<p>{props.account}</p>
		</div>
	)
}

function Header(props) {
	return (
		<div className="Header">
			<Worklow
				status={props.status}
			/>
			<Address
				account={props.account}
			/>
		</div>
		)
}

export default Header;