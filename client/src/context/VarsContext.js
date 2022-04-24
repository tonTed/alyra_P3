import React, {createContext, useState} from "react";

export const VarsContext = createContext();

const VarsContextProvider = (props) => {
	
	const {contract, _setContract} = useState(null);
	const setContract = (_contract) => _setContract(_contract);

	const {owner, _setOwner} = useState(null);
	const setOwner = (_owner) => _setContract(_owner);

	const {status, _setStatus} = useState(null);
	const setStatus = (_status) => _setStatus(_status);

	const {adminStatus, _setAdminStatus} = useState(null);
	const setAdminStatus = (_adminStatus) => _setContract(_adminStatus);

	const {isVoter, _setIsVoter} = useState(null);
	const setIsVoter = (_isVoter) => _setContract(_isVoter);

	const {voters, _setVoters} = useState([]);
	const setVoters = (_voters) => _setContract(_voters);

	return (
		<VarsContext.Provider value={{
			contract, setContract,
			owner, setOwner,
			status, setStatus,
			adminStatus, setAdminStatus,
			isVoter, setIsVoter,
			voters, setVoters,
			}}>
				{props.children}
		</VarsContext.Provider>
	)
}

export default VarsContextProvider;