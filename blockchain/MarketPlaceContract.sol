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
        Quiz memory newQuiz = Quiz(_id, msg.sender, _minAmt, _maxAmt, 0, new uint256[](0), false);
        quizMap[_id] = newQuiz;
        sellerMap[msg.sender].quizzes.push(_id);
        emit QuizCreated(_id, msg.sender, _minAmt, _maxAmt);
    }
    function endQuiz(uint256 _QuizId) public onlySeller {
        require(quizMap[_QuizId].owner == msg.sender, "Only owner can end the quiz");
        require(quizMap[_QuizId].isEnded == false, "Quiz is already ended");
        quizMap[_QuizId].isEnded = true;

        transferRewardsToWinner(_QuizId);
        
        emit QuizEnded(_QuizId, msg.sender, quizMap[_QuizId].totalAmt);
    }

    //Contract's core functions
    function generateReward(uint256 _TicketId, uint256 _percent) private view returns (uint256){
        uint256 reward = (ticketMap[_TicketId].amt * _percent) / 100;
        return reward;
    }
    function transferRewardsToWinner(uint256 _QuizId) public payable{
        require(quizMap[_QuizId].isEnded == true, "Quiz is not ended yet");
        require(quizMap[_QuizId].owner == msg.sender, "Only owner can transfer rewards");
        uint256 totalTickets = quizMap[_QuizId].tickets.length;
        uint256 rewardPercent = 100 / totalTickets;
        for (uint256 i = 0; i < totalTickets; i++) {
            uint256 reward = generateReward(quizMap[_QuizId].tickets[i], rewardPercent);
            payable(ticketMap[quizMap[_QuizId].tickets[i]].owner).transfer(reward);
            //removing the used ticket from buyer's list and updating the total amount
            for (uint256 j = 0; j < buyerMap[ticketMap[quizMap[_QuizId].tickets[i]].owner].tickets.length; j++) {
                if (buyerMap[ticketMap[quizMap[_QuizId].tickets[i]].owner].tickets[j] == quizMap[_QuizId].tickets[i]) {
                    buyerMap[ticketMap[quizMap[_QuizId].tickets[i]].owner].totalAmt -= ticketMap[quizMap[_QuizId].tickets[i]].amt;
                    delete buyerMap[ticketMap[quizMap[_QuizId].tickets[i]].owner].tickets[j];
                    break;
                }
            }
            emit Withdrawn(ticketMap[quizMap[_QuizId].tickets[i]].owner, reward);
        }
    }

    //For Buyer
    function buyTicket(uint256 _QuizId) public payable onlyBuyer {
        require(quizMap[_QuizId].isEnded == false, "Quiz is already ended");
        require(msg.value >= quizMap[_QuizId].minAmt && msg.value <= quizMap[_QuizId].maxAmt, "Amount should be between min and max amount");


        //generating ticket id
        uint256 totalTickets = quizMap[_QuizId].tickets.length;
        uint256 Date = block.timestamp;
        uint256 iD = Date + totalTickets;

        Ticket memory newTicket = Ticket(iD, msg.sender, msg.value, _QuizId);
        ticketMap[iD] = newTicket;
        quizMap[_QuizId].tickets.push(iD);
        buyerMap[msg.sender].tickets.push(iD);
        buyerMap[msg.sender].totalAmt += msg.value;
        quizMap[_QuizId].totalAmt += msg.value;

        emit TicketBought(iD, msg.sender, msg.value, _QuizId);
    }

    //Registration functions
    function registerAsSeller() public {
        require(sellerMap[msg.sender].id == 0, "Already registered as Seller");
        Seller memory newSeller = Seller(sellerMap[msg.sender].quizzes.length + 1, msg.sender, new uint256[](0), 0);
        sellerMap[msg.sender] = newSeller;
    }

    function registerAsBuyer() public {
        require(buyerMap[msg.sender].id == 0, "Already registered as Buyer");
        Buyer memory newBuyer = Buyer(buyerMap[msg.sender].tickets.length + 1, msg.sender, new uint256[](0), 0);
        buyerMap[msg.sender] = newBuyer;
    }
}