import React, { Component } from "react";
import VotingContract from "../contracts/Voting.json";

import "./components.css";

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

class Body extends Component {
	state = {
		proposals: [],
	}

	// onSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("refresh prevented");
  // };

	componentDidMount = async () => {
			this.setState({proposals: await this.getProposals()});
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
		return (<ul>{this.state.proposals.map((e, i) => <li key={i}>${e['desc']}</li>)}</ul>);
	}

	addProposal = async (e) => {
		e.preventDefault();
		this.props.contract.methods.addProposal(this.textInput.value)
			.send({from: this.props.account})
			.then(() => {
				this.setState({proposals: [...this.state.proposals, {'desc': this.textInput.value, 'count': 0}]})
			})
	}

	render() {
		return (
			<div id="body">
				<div><form onSubmit={this.addProposal}>
						<label>Proposal:
							<input type="text" ref={(input) => {this.textInput = input}}/>
						</label>
						<input type="submit" value="Submit"/>
				</form></div>
				<div>
					{this.renderProposals()}
				</div>
			</div>
		)
	}
}

export default Body;