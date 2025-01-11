// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

contract MarketPlaceContract {
    //Admin address
    address private admin;
    //Variables and structs
    struct Ticket {
        uint256 id;
        address owner;
        uint256 amt;
        uint256 quizId;
    }
    //map list for tickets
    mapping(uint256 => Ticket) public ticketMap;
    struct Quiz {
        uint256 id;
        address owner;
        uint256 minAmt;
        uint256 maxAmt;
        uint256 totalAmt;
        uint256[] tickets;
        bool isEnded;
    }
    //map list for quizzes
    mapping(uint256 => Quiz) public quizMap;

    struct Buyer {
        uint256 id;
        address walletAdd;
        uint256[] tickets;
        uint256 totalAmt;
    }
    //map list for Buyer
    mapping(address => Buyer) public buyerMap;

    struct Seller {
        uint256 id;
        address walletAdd;
        uint256[] quizzes;
        uint256 totalAmt;
    }
    //map list for Seller
    mapping(address => Seller) public sellerMap;

    constructor() {
        admin = msg.sender;
    }

    //Modifiers
    modifier onlySeller() {
        require(sellerMap[msg.sender].id > 0, "Only Seller can call this function");
        _;
    }
    modifier onlyBuyer() {
        require(buyerMap[msg.sender].id > 0, "Only Buyer can call this function");
        _;
    }
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only Admin can call this function");
        _;
    }

    //Events
    event QuizCreated(uint256 id, address owner, uint256 minAmt, uint256 maxAmt);
    event TicketBought(uint256 id, address owner, uint256 amt, uint256 quizId);
    event QuizEnded(uint256 id, address owner, uint256 totalAmt);
    event Withdrawn(address owner, uint256 amt);

    //Functions

    //For Seller
    function createQuiz(uint256 _minAmt, uint256 _maxAmt, uint256 _id) public onlySeller {
        require(_minAmt > 0, "Minimum amount should be greater than 0");
        require(_maxAmt > _minAmt, "Maximum amount should be greater than minimum amount");
        uint256 id = _id;
        Quiz memory newQuiz = Quiz(id, msg.sender, _minAmt, _maxAmt, 0, new uint256[](0), false);
        quizMap[id] = newQuiz;
        sellerMap[msg.sender].quizzes.push(id);
        emit QuizCreated(id, msg.sender, _minAmt, _maxAmt);
    }
    function endQuiz(uint256 _id) public onlySeller {
        require(quizMap[_id].owner == msg.sender, "Only owner can end the quiz");
        require(quizMap[_id].isEnded == false, "Quiz is already ended");
        quizMap[_id].isEnded = true;

        //TODO: "Transfer the total amount to the seller" create a function for this and call it here
        
        emit QuizEnded(_id, msg.sender, quizMap[_id].totalAmt);
    }
}