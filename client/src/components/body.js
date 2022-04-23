import React, { Component } from "react";
import VotingContract from "../contracts/Voting.json";

import "./components.css";

class Body extends Component {
	state = {
		proposals: [],
	}

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

	render() {
		return (
			<div id="body">
				<div>
					<label id="lname">Last name:</label>
					<input type="text" id="lname" name="lname"/>
					<input type="submit" value="Submit"/>
				</div>
				<div>
					{this.renderProposals()}
				</div>
			</div>
		)
	}
}

export default Body;