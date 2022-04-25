import React from "react";

function Message(props){
	let message = "";
	if (!props.accounts.isVoter)
		message = "YOU ARE NOT A VOTER"
	else if (props.status == 0)
		message = "PROPOSALS SESSION NOT STARTED YET"
	else if (props.status == 2)
		message = "VOTE SESSION NOT STARTED YET"
	else if (props.status == 4)
		message = "VOTE SESSION IS ENDED WAIT FOR TALLY VOTE"
	else
		return (null);
	return (
		<div className="Message">
			{message}
		</div>
	)
}

export default Message;