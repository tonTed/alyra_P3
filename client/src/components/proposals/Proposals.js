import React from "react";

function Proposals(props) {
	if (!props.proposals.length)
		return (null);
	return (
		<div className="Proposals">
			<ul>{props.proposals.map((e, i) => <li key={i}>{`[${i}] - ${e['desc']}`}</li>)}</ul>
		</div>
	)
}

export default Proposals