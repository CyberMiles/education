# Bet Game Description

## 1. Contract and function
```
contract BettingGame {
    
    function startGame() external onlyOwner { 
    }
    
    function placeBet (safeuint _choice) public payable {
    }
    
    function endGame(safeuint _correct_choice) {
    }
    
    function payMe () public {
    }
  
    function terminate() external onlyOwner {
        selfdestruct(owner);
    }
}
```

## 2. Set Owner of the contract

```
    address public owner;

    safeuint game_status; // 0 not started; 1 running; 2 ended
    
    modifier onlyOwner() {
        assert(msg.sender == owner);
        _;
    }
    
    constructor () public {
        owner = msg.sender;
        game_status = 0;
    }
```

## 3. Constract Bet type

```
    struct Bet {
        safeuint choice;
        safeuint amount;
        bool paid;
        bool initialized;
    }
    mapping(address => Bet) bets;
```

## 4. Caculate total bet 
```
    safeuint total_bet_amount;
    mapping(safeuint => safeuint) choice_bet_amounts;
```

## 5. Start Game

```   
     function startGame() external onlyOwner {   
     // initiate total_bet_amount and game_status
     // write your code
    }
```

## 5. Save correct choice provided by owner
```
    safeuint correct_choice;
    
    function getAnswer() public view returns (safeuint) {
        return (correct_choice);
    }
```

## 6. User place their bet and wait for rewards 

```
    function placeBet (safeuint _choice) public payable {
    // these edge checking is boring, I already help you write them.
        require (game_status == 1); // game is running
        require (_choice > 0);
        require (_choice <= 12);
        require (msg.value > 0); // Must have bet amount
        require (bets[msg.sender].initialized == false); // Cannot bet twice
        
        // every player's bet detail
        // 👨‍💻‍
        
        // stat and sum amounts by choice
        // 👨‍💻‍
        
    }

```

## 7. End Game
```
    function endGame(safeuint _correct_choice) external onlyOwner {
        // input correct_choice & change game_status
        // 👨‍💻‍
    }
```

## 8. Pay me 
```
    function payMe () public {
        require (game_status == 2); // game is done
        require (bets[msg.sender].initialized); // Must have a bet
        require (bets[msg.sender].amount > 0); // More than zero
        require (bets[msg.sender].choice == correct_choice); // chose correctly
        require (bets[msg.sender].paid == false); // chose correctly
        
        // caculate player's reward and update paid_status
        // 👨‍💻‍
    }
```

## 6. Cleanup contract 🤑

```
    function terminate() external onlyOwner {
        selfdestruct(owner);
    }
```
