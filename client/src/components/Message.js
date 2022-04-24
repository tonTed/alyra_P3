import React, { Component } from "react";

async function isVoter(contract, account)
{
	try{
		await contract.methods.getVoter(account).call();
		return (true);
	} catch (error) {
		return (false);
	}
}

export default function Message(props){
	if (props.adminStatus)
		return (null);
	if (props.status == 0)
		return(<div>PROPOSAL SESSION NOT STARTED YET</div>)
	if (props.status == 2 && props.isVoter)
		return(<div>VOTING SESSION NOT STARTED YET</div>)
	return(<div>YOU ARE NOT A VOTER</div>)
}