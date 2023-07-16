// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';
import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';

contract DAROSmartContract is AxelarExecutable{

    IAxelarGasService public immutable gasService;
    constructor(
        address gateway_,
        address gasReceiver_
    ) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
    }

    struct Review {
        address reviewer;
        string feedback;
        uint256 score;
    }

    struct Publication {
        uint256 id;
        address researcher;
        string title;
        string description;
        string hash;
        uint256 timestamp;
        bool reviewed;
        bool rewarded;
        uint256[] reviewIds; // Array to store review IDs
        address[] contributors;
        uint256 totalContributions;
    }

    struct Updates {
        uint256 timestamp;
        address userAddress;
        string description;
        string data;
    }

    struct Requests {
        uint256 timestamp;
        uint256 id;
        address userAddress;
        string data;
        bool Approved;
    }

    // Mapping to store research publications
    mapping(uint256 => Publication) public publications;
    // Mapping to store reviews
    mapping(uint256 => Review) public reviews;
    mapping(uint256 => Review[]) public getReviews;
    // Mapping to update research publications
    mapping(uint256 => Updates[]) public userUpdates;
    // Mapping requests to research_id
    mapping(uint256 => mapping(address => Requests[])) public requestContribution;

    // Counter to assign unique IDs to publications and reviews
    uint256 public publicationCounter;
    uint256 public reviewCounter;

    // Event triggered when a new research publication is submitted
    event PublicationSubmitted(uint256 indexed publicationId, address indexed researcher);

    //Mapping for Researchers with their publications
    mapping(address => Publication[]) public publicationsByAddress;
    mapping(uint256 => address) public isOwner;

    //Mapping of all fileHashes to their research_id
    mapping(uint256 => string[]) public filesHash;
    //Mapping of all Contributors to their research_id
    mapping(uint256 => mapping(address => bool)) public contributors;
    //message for individual address
    mapping(address => Requests[]) public messages;

    // Modifier to ensure only the owner can access certain functions
    modifier onlyOwner(uint256 _id) {
        require(msg.sender == isOwner[_id], "Only the owner can perform this action");
        _;
    }

    // Modifier to ensure only the owner or contributors can access certain functions
    modifier onlyOwnerOrContributor(uint256 _id) {
        require(msg.sender == isOwner[_id] || contributors[_id][msg.sender], "Only the owner or contributors can perform this action");
        _;
    }

    //function to add publications into blockchain
    function addPublication(
        string memory _title,
        string memory _description,
        string memory _fileHash
    ) public {
        publicationCounter++;
        Publication memory newPublication = Publication(
            publicationCounter,
            msg.sender,
            _title,
            _description,
            _fileHash,
            block.timestamp,
            false,
            false,
            new uint256[](0),// Initialize an empty array of review IDs
            new address[](0),
            0 
        );
        publications[publicationCounter] = newPublication;
        publicationsByAddress[msg.sender].push(newPublication);
        filesHash[publicationCounter].push(_fileHash);
        isOwner[publicationCounter] = msg.sender;

        emit PublicationSubmitted(publicationCounter, msg.sender);
    }

    //function to update publications
    function updatePublications(uint256 _id, string memory _fileHash,string memory _description) public onlyOwnerOrContributor(_id) {
        filesHash[_id].push(_fileHash);
                Updates memory updates = Updates(block.timestamp, msg.sender,_description, _fileHash);
        userUpdates[_id].push(updates);
    }

    //function to contribute to a publication
    function contribute(uint256 _id, string memory _description) public {
        Requests memory request = Requests(block.timestamp,_id, msg.sender, _description,false);
        requestContribution[_id][msg.sender].push(request);
        messages[publications[_id].researcher].push(request);
    }

    //function to allow a contributor
    function allowContributor(uint256 _id, address _contributor) public onlyOwner(_id) {
        contributors[_id][_contributor] = true;
        publications[_id].contributors.push(_contributor);
         Requests memory request = Requests(block.timestamp,_id, msg.sender, "You can contribute now",true);
        messages[_contributor].push(request);
        publicationsByAddress[_contributor].push(publications[_id]);
    }

    //function to add a review to a publication
    function addReview(uint256 _id, string memory _feedback, uint256 _score) public {
        require(publications[_id].reviewed == false, "Publication has already been reviewed");

        Review memory review = Review({
            reviewer: msg.sender,
            feedback: _feedback,
            score: _score
        });

        uint256 reviewId = reviewCounter + 1; // Generate a new review ID
        reviewCounter++;
        getReviews[_id].push(review);

        publications[_id].reviewIds.push(reviewId);
        reviews[reviewId] = review; // Store the review in the reviews mapping
        publications[_id].reviewed = true;
        
    }

    //function to get the average score of a publication
    function getAverageScore(uint256 _id) public view returns (uint256) {
        require(publications[_id].reviewed == true, "Publication has not been reviewed yet");

        uint256[] memory reviewIds = publications[_id].reviewIds;
        uint256 totalScore = 0;

        for (uint256 i = 0; i < reviewIds.length; i++) {
            totalScore += reviews[reviewIds[i]].score;
        }
        return totalScore / reviewIds.length;
    }


    string public sourceChain;
    string public sourceAddress;
    function contributeFunds(uint256 _id) external payable {
        
        if (msg.value > 0.001 ether) {
            gasService.payNativeGasForContractCall{ value: 0.001 ether }(
                address(this),
                sourceChain,
                sourceAddress,
                msg.data,
                msg.sender
            );
        }
        publications[_id].totalContributions+=(msg.value-0.001 ether);

    }

    string public value;
    function _execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) internal override {
        (value) = abi.decode(payload_, (string));
        sourceChain = sourceChain_;
        sourceAddress = sourceAddress_;
    }

    function distributeFunds(uint256 _id) public onlyOwner(_id) {
        uint256 totalAmountRaised= publications[_id].totalContributions;
        uint256 creatorAmount = totalAmountRaised * 70 / 100; // 70% of totalAmountRaised to the creator
        uint256 contributorAmount = totalAmountRaised - creatorAmount; // Remaining amount to contributors
        
        // Transfer funds to the creator
        payable(publications[_id].researcher).transfer(creatorAmount);

        // Distribute funds among contributors
        for (uint256 i = 0; i < publications[_id].contributors.length; i++) {
            address contributor = publications[_id].contributors[i];
            uint256 contributorShare = (contributorAmount) / publications[_id].contributors.length;
            payable(contributor).transfer(contributorShare);
        }
        // Reset the funding details
        publications[_id].totalContributions = 0;
    }

    function getPublicationsByAddress(address _owner) public view returns(Publication[] memory){
        return publicationsByAddress[_owner];
    }

    function getPublicationById(uint256 _id) public view returns(Publication memory){
        return publications[_id];
    }

    function getMessage(address _owner)public view returns(Requests[] memory){
        return messages[_owner];
    }

    function getUserUpdates(uint256 _id) public view returns(Updates[] memory){
        return userUpdates[_id];
    }

    function getReview(uint256 _id) public view returns(Review[] memory){
        return getReviews[_id];
    }

    function getHashById(uint256 _id)public view returns(string[] memory){
        return filesHash[_id];
    }
}


// Address: 0xb255Bc85069bDe14D66333Abb89ab7a226F39D39