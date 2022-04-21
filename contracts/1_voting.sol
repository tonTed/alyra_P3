// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;
import "@openzeppelin/contracts/access/Ownable.sol";

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

    // ::::::::::::: GETTERS ::::::::::::: //

    function getVoter(address _addr) external view onlyVoters returns (Voter memory){
        return voters[_addr];
    }

    function getOneProposal(uint256 _id) external view onlyVoters returns (Proposal memory){
        return proposalsArray[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //

    function addVoter(address _addr) public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters,
		"Voters registration is not open yet");
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //

    function addProposal(string memory _desc) external onlyVoters {
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

    function resetWorklow() external onlyOwner {
        workflowStatus = WorkflowStatus.RegisteringVoters;
    }


    constructor() {
        voters[address(0xBF2C49df4a77f583C06A190ff71dD153FD84000a)].isRegistered = true;
        voters[address(0x92218796747cb1B8490ef3275d81F028291F3E7C)].isRegistered = true;
        voters[address(0x709c337524C506cf9584029e54c151Efd6D2D436)].isRegistered = true;
        voters[address(0x81FF5c6A3eE359ecBc7747740A4d16442180f836)].isRegistered = true;
           
        proposalsArray.push(Proposal("Proposal 0", 0));
        proposalsArray.push(Proposal("Proposal 1", 0));
        proposalsArray.push(Proposal("Proposal 2", 0));
        proposalsArray.push(Proposal("Proposal 3", 0));
        proposalsArray.push(Proposal("Proposal 4", 0));
        proposalsArray.push(Proposal("Proposal 5", 0));
        proposalsArray.push(Proposal("Proposal 6", 0));
        proposalsArray.push(Proposal("Proposal 7", 0));
    }


    function resetFlow() external onlyOwner {
        voters[0xBF2C49df4a77f583C06A190ff71dD153FD84000a].isRegistered = true;
        voters[0x92218796747cb1B8490ef3275d81F028291F3E7C].isRegistered = true;
        voters[0x709c337524C506cf9584029e54c151Efd6D2D436].isRegistered = true;
        voters[0x81FF5c6A3eE359ecBc7747740A4d16442180f836].isRegistered = true;

        proposalsArray[0] = Proposal("Proposal 0", 0);
        proposalsArray[1] = Proposal("Proposal 1", 0);
        proposalsArray[2] = Proposal("Proposal 2", 0);
        proposalsArray[3] = Proposal("Proposal 3", 0);
        proposalsArray[4] = Proposal("Proposal 4", 0);
        proposalsArray[5] = Proposal("Proposal 5", 0);
        proposalsArray[6] = Proposal("Proposal 6", 0);
        proposalsArray[7] = Proposal("Proposal 7", 0);

        workflowStatus = WorkflowStatus.RegisteringVoters;
    }
}