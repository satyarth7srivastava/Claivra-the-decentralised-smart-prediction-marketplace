// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

contract MarketPlaceContract {
    //Admin address
    address private admin;
    uint256 private profit = 0;
    uint256 private constant ONE_ETH = 10**18;
    //mapping for admin address
    mapping(address => bool) public isAdminMap;
    //Variables and structs
    struct Ticket {
        uint256 id;
        address owner;
        uint256 amt;
        uint256 quizId;
        uint256 betIndex;
        bool isWithdrawn;
        uint256 winAmt;
    }
    //map list for tickets
    mapping(uint256 => Ticket) public ticketMap;
    struct Quiz {
        uint256 id;
        address owner;
        uint256 minAmt;
        uint256 maxAmt;
        uint256 totalAmt;
        uint256[] options;
        uint256[] tickets;
        bool isEnded;
        bool isApproved;
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
        isAdminMap[admin] = true; // Set the contract deployer as admin
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
    modifier AdminRights() {
        require(isAdminMap[msg.sender], "Only Admin can call this function");
        _;
    }

    //Events
    event QuizCreated(uint256 id, address owner, uint256 minAmt, uint256 maxAmt);
    event TicketBought(uint256 id, address owner, uint256 amt, uint256 quizId);
    event QuizEnded(uint256 id, address owner, uint256 totalAmt);
    event Withdrawn(address owner, uint256 amt);

    //Functions

    //For Seller
    function createQuiz(uint256 _minAmt, uint256 _maxAmt, uint256 _id, uint256 _numOfoptions) public onlySeller {
        require(_minAmt > 0, "Minimum amount should be greater than 0");
        require(_maxAmt > _minAmt, "Maximum amount should be greater than minimum amount");
        Quiz memory newQuiz = Quiz(_id, msg.sender, _minAmt, _maxAmt, 0, new uint256[](_numOfoptions + 1), new uint256[](0), false, false);

        quizMap[_id] = newQuiz;
        sellerMap[msg.sender].quizzes.push(_id);
        emit QuizCreated(_id, msg.sender, _minAmt, _maxAmt);
    }
    function endQuiz(uint256 _QuizId, uint256 _WinningInd) public onlySeller {
        require(quizMap[_QuizId].owner == msg.sender, "Only owner can end the quiz");
        require(quizMap[_QuizId].isEnded == false, "Quiz is already ended");
        quizMap[_QuizId].isEnded = true;

        transferRewardsToWinner(_QuizId, _WinningInd);
        
        emit QuizEnded(_QuizId, msg.sender, quizMap[_QuizId].totalAmt);
    }

    //Contract's core functions
    function generateReward(uint256 _TicketId, uint256 _TotalAmt, uint256 correctOptionBet) private view returns (uint256){
        if(correctOptionBet == 0) {
            return 0; // Avoid division by zero
        }
        if(ticketMap[_TicketId].amt == 0) {
            return 0; // No amount bet on this ticket
        }
        uint256 reward = (ticketMap[_TicketId].amt / correctOptionBet) * _TotalAmt;
        return reward;
    }
    function transferRewardsToWinner(uint256 _QuizId, uint256 _WinningInd) public payable{
        require(quizMap[_QuizId].isEnded == true, "Quiz is not ended yet");
        require(quizMap[_QuizId].owner == msg.sender, "Only owner can transfer rewards");
        uint256 totalTickets = quizMap[_QuizId].tickets.length;
        uint256 totalAmount = quizMap[_QuizId].totalAmt;
        uint256 fee = totalAmount * 5 / 100;
        totalAmount -= fee;
        profit += fee;
        payable(admin).transfer(fee);
        for (uint256 i = 0; i < totalTickets; i++) {
            if(ticketMap[quizMap[_QuizId].tickets[i]].betIndex == _WinningInd){
                uint256 reward = generateReward(quizMap[_QuizId].tickets[i], totalAmount, quizMap[_QuizId].options[_WinningInd]);
                payable(ticketMap[quizMap[_QuizId].tickets[i]].owner).transfer(reward);
                //setting ticket as withdrawn
                ticketMap[quizMap[_QuizId].tickets[i]].isWithdrawn = true;
                ticketMap[quizMap[_QuizId].tickets[i]].winAmt = reward;
                buyerMap[ticketMap[quizMap[_QuizId].tickets[i]].owner].totalAmt += reward;
                emit Withdrawn(ticketMap[quizMap[_QuizId].tickets[i]].owner, reward);
            }
        }
    }

    //For Buyer
    function buyTicket(uint256 _QuizId, uint256 betIndex) public payable onlyBuyer {
        require(quizMap[_QuizId].isEnded == false, "Quiz is already ended");
        require(msg.value >= quizMap[_QuizId].minAmt && msg.value <= quizMap[_QuizId].maxAmt, "Amount should be between min and max amount");


        //generating ticket id
        uint256 totalTickets = quizMap[_QuizId].tickets.length;
        uint256 Date = block.timestamp;
        uint256 iD = Date + totalTickets;


        Ticket memory newTicket = Ticket(iD, msg.sender, msg.value, _QuizId, betIndex, false, 0);
        ticketMap[iD] = newTicket;
        quizMap[_QuizId].tickets.push(iD);
        buyerMap[msg.sender].tickets.push(iD);
        buyerMap[msg.sender].totalAmt += msg.value;
        quizMap[_QuizId].totalAmt += msg.value;
        quizMap[_QuizId].options[betIndex] += msg.value;
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

    function login(address _walletAdd, bool isBuyer) public view returns (address) {
        if (sellerMap[_walletAdd].id > 0 && isBuyer == false) {
            return _walletAdd;
        } else if (buyerMap[_walletAdd].id > 0 && isBuyer == true) {
            return _walletAdd;
        } else {
            return address(0);
        }
    }

    //getter functions
    function getTicket(uint256 _id) public view returns (Ticket memory) {
        return ticketMap[_id];
    }
    function getQuiz(uint256 _id) public view returns (Quiz memory) {
        return quizMap[_id];
    }
    function getBuyer(address _walletAdd) public view returns (Buyer memory) {
        return buyerMap[_walletAdd];
    }
    function getSeller(address _walletAdd) public view returns (Seller memory) {
        return sellerMap[_walletAdd];
    }
    function getAdmin() public view returns (address) {
        return admin;
    }
    function getPredictedWinAmount(uint256 _QuizId, uint8 _betIndex, uint256 _amt) public view returns (uint256) {
        require(quizMap[_QuizId].id > 0, "Quiz does not exist");
        require(quizMap[_QuizId].isEnded == false, "Quiz is already ended");
        require(_amt >= quizMap[_QuizId].minAmt && _amt <= quizMap[_QuizId].maxAmt, "Amount should be between min and max amount");
        uint256 totalAmount = quizMap[_QuizId].totalAmt;
        if( totalAmount == 0) {
            return 0; // No bets placed yet
        }
        uint256 fee = totalAmount * 5 / 100;
        totalAmount -= fee;
        uint256 betOnOption = quizMap[_QuizId].options[_betIndex];
        if( betOnOption == 0) {
            betOnOption = 1; // Avoid division by zero
        }
        uint256 reward = (_amt / betOnOption) * totalAmount;
        return reward;
    }

    //funciton for admin to withdraw amount from contract
    function withdraw(uint256 _amt) public onlyAdmin {
        require(_amt > 0, "Amount should be greater than 0");
        require(_amt <= address(this).balance, "Insufficient balance");
        require(_amt <= profit, "Amount should be less than profit");
        payable(admin).transfer(_amt);
        profit -= _amt;
        emit Withdrawn(admin, _amt);
    }
    function withdrawAll() public onlyAdmin {
        require(profit > 0, "No balance to withdraw");
        payable(admin).transfer(profit);
        emit Withdrawn(admin, profit);
    }

    //TODO: Add function to register as admin with some security checks
    function registerAsAdmin() public{
        require(!isAdminMap[msg.sender], "Already registered as Admin");
        isAdminMap[msg.sender] = true;
    }

    //Functions for admin to approve or reject quiz requests
    function appvoreRequest(uint256 _QuizId) public AdminRights {
        require(quizMap[_QuizId].isApproved == false, "Quiz is already approved");
        quizMap[_QuizId].isApproved = true;
    }
    function rejectRequest(uint256 _QuizId) public AdminRights {
        require(quizMap[_QuizId].isApproved == false, "Quiz is already approved");
        quizMap[_QuizId].isApproved = false;
    }
    function getProfit() public view AdminRights returns (uint256) {
        return profit;
    }
}