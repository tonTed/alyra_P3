import React, { Component } from "react";

import "./components.css";
import Input from "./Input.js"

class Body extends Component {
	state = {
		proposals: [],
	}

	componentDidMount = async () => {
			this.setState({proposals: await this.getProposals()});
	}

	updateInput = (input) => {
		this.textInput = input;
	}

	getProposals = async () => {
		let array = [];
		let ret = [];
		let tmp;
		for (let i = 0; ; i++){
			try {
				tmp = await this.props.contract.methods.proposalsArray(i).call();
				array.push(tmp);
			} catch {
				break ;
			}
		}
		array.forEach((e) => ret.push({'desc': e['description'], 'count': e['voteCount']}))
		return (ret);
	}

	renderProposals = () => {
		return (
		<div>
			<ul>{this.state.proposals.map((e, i) => <li key={i}>${e['desc']}</li>)}</ul>
		</div>
		)}

	addVoter = async (e) => {
		e.preventDefault();
		this.props.contract.methods.addVoter(this.textInput.value)
			.send({from: this.props.account})
			// .then(() => {
			// 	this.setState({proposals: [...this.state.proposals, {'desc': this.textInput.value, 'count': 0}]})
			// })
		this.textInput = "";
	}

	addProposal = async (e) => {
		e.preventDefault();
		this.props.contract.methods.addProposal(this.textInput.value)
			.send({from: this.props.account})
			.then(() => {
				this.setState({proposals: [...this.state.proposals, {'desc': this.textInput.value, 'count': 0}]})
			})
		this.textInput = "";
	}

	render() {
		return (
			<div id="body">
				<Input
				status={this.props.status}
				addVoter={this.addVoter}
				addProposal={this.addProposal}
				updateInput={this.updateInput}
				admin={this.props.admin}
				/>
				<div>{this.renderProposals()}</div>
			</div>
		)
	}
}

export default Body;