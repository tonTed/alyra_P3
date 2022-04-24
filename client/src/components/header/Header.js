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

function Workflow(props) {
	const _status = props.status.value;
		return (
			<div className="Workflow">
				<p>{`${_status}: ${status[_status].name}`}</p>
			</div>
		)
}

function AdminButton(props) {
	return (
		<button onClick={props.admin.func}>
			{props.admin.value ? 'Admin Dashbord' : 'Admin'}
			</button>
	)
}

function Address(props) {
	// console.log(props.accounts.isOwner);
	return (
		<div className="Address">
			<p>{props.accounts.connected}</p>
			{props.accounts.isOwner ? <AdminButton admin={props.admin}/> : null}
		</div>
	)
}

function Header(props) {
	return (
		<div className="Header">
			<Workflow
				status={props.status}
			/>
			<Address
				accounts={props.accounts}
				admin={props.admin}
			/>
		</div>
		)
}

export default Header;