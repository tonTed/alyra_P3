import React, { useState } from 'react'
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

function Input(props) {
	return (
		<div className='Input'>
			<AddVoterInput
				addVoter={props.addVoter}
			/>
		</div>
	)
}

export default Input;
