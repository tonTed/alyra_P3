import React, { useState } from 'react'
import Proposals from '../proposals/Proposals';
import './Input.css'

function AddVoterInput(props) {

	const [textInput, setTextInput] = useState();

	const addVoter = (e) => {
		e.preventDefault();
		props.addVoter(textInput);
		setTextInput("");
	}

	return (
		<form onSubmit={addVoter}>
			<input value={textInput} onChange={e => setTextInput(e.target.value)} type="text" />
			<input type="submit" value="Add Voter" />
		</form>
	)
}

function AddProposalInput(props) {

	const [textInput, setTextInput] = useState();

	const addProposal = (e) => {
		e.preventDefault();
		props.addProposal(textInput); 
		setTextInput("");
	}

	return (
		<form onSubmit={addProposal}>
			<input value={textInput} onChange={e => setTextInput(e.target.value)} type="text" />
			<input type="submit" value="Add Proposal" />
		</form>
	)
}

function Input(props) {
	if (props.status == 0 && props.admin.value) {
		return (
			<div className='Input'>
				<AddVoterInput addVoter={props.addVoter} />
			</div>
		)
	}
	if (!props.accounts.isVoter)
		return (null);
	if (props.status == 1)
		return (
			<div className='Input'>
				<AddProposalInput addProposal={props.addProposal} />
			</div>
		)
	return (null);
}

export default Input;
