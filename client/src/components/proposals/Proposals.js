import React from "react";

function Proposals(props) {
	return (
		<div className="Proposals">
			<ul>{props.proposals.map((e, i) => <li>{`[${i}] - ${e['desc']}`}</li>)}</ul>
		</div>
	)
}

export default Proposals