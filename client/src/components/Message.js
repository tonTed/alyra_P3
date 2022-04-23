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
		return(<div>PROPOSAL SESSION NOT STARTING YET</div>)
	if (props.status == 1 && !props.isVoter)
		return(<div>YOU ARE NOT A VOTER</div>)
	return (null);
}