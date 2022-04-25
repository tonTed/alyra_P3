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

function VoteProposalInput(props){

	const [textInput, setTextInput] = useState();

	const voteProposal = (e) => {
		const proposalId = textInput;
		e.preventDefault();
		props.contract.methods.setVote(proposalId)
			.send({from: props.accounts.connected})
			.then(() => {
				alert(`you have voted for the proposal ${proposalId} (${props.proposals[proposalId]['desc']})`)
				props.hasVotedFunc(true);
			})
		setTextInput("");
	}

	return (
		<form onSubmit={voteProposal}>
			<input 
				value={textInput}
				onChange={e => setTextInput(e.target.value)} 
				type="number"
				min={0}
				max={props.proposalAmount - 1}
			/>
			<input type="submit" value="Add Proposal" />
		</form>
	)
}

function Input(props) {

	const [hasVoted, setHasVoted] = useState(false);

	const getHasVoted = async() => {
		const voter = await props.contract.methods
			.getVoter(props.accounts.connected)
			.call({from: props.accounts.connected})
		setHasVoted(voter['hasVoted']);
	}

	if (props.status == 0 && props.admin.value) {
		return (
			<div className='Input'>
				<AddVoterInput addVoter={props.addVoter} />
			</div>
		)
	}
	if (!props.accounts.isVoter || props.status >= 4)
		return (null);

	getHasVoted();
	
	if (props.status == 1)
		return (
			<div className='Input'>
				<AddProposalInput addProposal={props.addProposal} />
			</div>
		)
	if (hasVoted)
		return (
			<div className='Message'>
				YOU HAVE ALREADY VOTED
			</div>
		)
	if (props.status == 3 )
		return (
			<div className='Input'>
				<VoteProposalInput 
					contract={props.contract}
					hasVotedFunc={setHasVoted}
					proposalAmount={props.proposalAmount}
					accounts={props.accounts}
					proposals={props.proposals}
				/>
			</div>
		)
	return (null);
}

export default Input;
