// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting project for Alyra School
 * @author Teddy Blanco [tonted]
 */
contract Voting is Ownable {
    uint256 public winningProposalID;

    WorkflowStatus public workflowStatus;
    Proposal[] public proposalsArray;
    mapping(address => Voter) private voters;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    modifier only100proposals() {
        require(proposalsArray.length <= 100, "Proposals ammount is over (100 max)");
        _;
    }

    // ::::::::::::: GETTERS ::::::::::::: //
    /*
     * @notice Can be only call by registered voter.
     * @param _addr The address of a voter
     * @return Voter (bool: isRegistered, bool: hasVoted, uint: votedProposalId)
     */
    function getVoter(address _addr) external view onlyVoters returns (Voter memory){
        return voters[_addr];
    }

    /*
     * @notice Can be only call by registered voter.
     * @param _id The id of the proposal
     * @return Proposal (string: description, uint256: voteCount)
     */
    function getOneProposal(uint256 _id) external view onlyVoters returns (Proposal memory){
        return proposalsArray[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //
    /*
     * @notice Can be only call by owner.
     * Add a voter in the whitelist, and can be add proposals and vote during their session.
     * @param _addr The address of a voter
     * Emits VoterRegistered (address: voterAddress) event.
     */
    function addVoter(address _addr) public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters,
		"Voters registration is not open yet");
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //
    /*
     * @notice Can be only call by voters.
     * Add a proposal, limits is 100 proposals.
     * @param _desc The description of the proposal
     * Emits ProposalRegistered (uint256 proposalId) event.
     */
    function addProposal(string memory _desc) external onlyVoters only100proposals {
        require( workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Proposals are not allowed yet"
        );
        require(
            keccak256(abi.encode(_desc)) != keccak256(abi.encode("")),
            "Vous ne pouvez pas ne rien proposer"
        );

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length - 1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /*
     * @notice Can be only call by voters.
     * Vote for one proposal only.
     * See `getOneProposal(uint _id)` for check the proposal decription.
     * @param _id the id of the proposal.
     * Emits ProposalRegistered (uint256 proposalId) event.
     */
    function setVote(uint256 _id) external onlyVoters {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found"); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //
    /*
     * @notice Can be only call by owner.
     * End the voter registration and start the proposal registering
     * Emits WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus) event.
     */
    function startProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.RegisteringVoters,
            "Registering proposals cant be started now"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    /*
     * @notice Can be only call by owner.
     * End the proposal registering
     * Emits WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus) event.
     */
    function endProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,
            "Registering proposals havent started yet"
        );
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    /*
     * @notice Can be only call by owner.
     * Start the voting registering
     * Emits WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus) event.
     */
    function startVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnded,
            "Registering proposals phase is not finished"
        );
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    /*
     * @notice Can be only call by owner.
     * End the voting registering
     * Emits WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus) event.
     */
    function endVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "Voting session havent started yet"
        );
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    /*
     * @notice Can be only call by owner.
     * Check the proposal winner and set the winner
     * see `winningProposalID`
     * Emits WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus) event.
     */
    function tallyVotes() external onlyOwner {
    	require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
    	uint _winningProposalId;
    	for (uint256 p = 0; p < proposalsArray.length; p++) {
        	if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
               _winningProposalId = p;
        	}
    	}
       winningProposalID = _winningProposalId;
       
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}