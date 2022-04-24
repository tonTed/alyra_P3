import React from "react";

function Message(props){
	let message = "";
	if (!props.accounts.isVoter)
		message = "YOU ARE NOT A VOTER"
	else
		return (null);
	return (
		<div className="Message">
			{message}
		</div>
	)
}

export default Message;