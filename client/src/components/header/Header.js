import React, { Component, useState } from "react";
import "./Header.css"

const status = [
	{name: "Registration Voters",					func: `contract.methods.startProposalsRegistering()`},
	{name: "Proposals Registering", 			func: `contract.methods.endProposalsRegistering()`},
	{name: "Proposals Registering Ended", func: `contract.methods.startVotingSession()`},
	{name: "Voting Session", 							func: `contract.methods.endVotingSession()`},
	{name: "Voting Session Ended", 				func: `contract.methods.tallyVotes()`},
	{name: "Votes Tallied", 							func: null},
]

function forwardStatus(contract, _status, accounts) {
	console.log(_status);
	eval(status[_status.value].func).send({from: accounts.connected})
		.then((res) => _status.func(res.events.WorkflowStatusChange.returnValues.newStatus))
}

function StatusButton(props) {
	return (
		<button onClick={() => forwardStatus(props.contract, props.status, props.accounts)}>
			{'Next >>>'}
		</button>
	)
}

function Workflow(props) {
	const _status = props.status.value;
		return (
			<div className="Workflow">
				<p>{`${_status}: ${status[_status].name}`}</p>
				{props.admin.value ? 
					<StatusButton 
						contract={props.contract}
						status={props.status}
						accounts={props.accounts}
					/> 
					: null}
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
				admin={props.admin}
				contract={props.contract}
				accounts={props.accounts}
			/>
			<Address
				accounts={props.accounts}
				admin={props.admin}
			/>
		</div>
		)
}

export default Header;