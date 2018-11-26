# Hello World

## Code Layout 🐣

### Indentation

Use 4 spaces per indentation level.

### Tabs or Spaces

Spaces are the preferred indentation method. Mixing tabs and spaces should be avoided.

### Blank Lines
Surround top level declarations in solidity source with two blank lines.

## Let's Code ⛷

### Version Pragma
```
pragma lity ^1.2.4;

```

### Contract and function

```
contract Human {
    
  function greet() {
  
  }

  function terminate() {
  
  }
}

```

### Set Owner of the contract

```
  address public owner;

    modifier onlyOwner() {
        assert(msg.sender == owner);
        _;
    }

    constructor () public {
        owner = msg.sender;
    }
```

### Implement greet function

When you call the greet(), it will return "Hello world"

```
  function greet() public pure returns (string) {
      return "Hello world";
  }
```

### Clean up our contract
contract owner terminate the human contract and we finish our first contract, Hooray 🏅

```
  function terminate() external onlyOwner {
    selfdestruct(owner);
  }
```


### Security Issues
What would happen if I didn't consider the security issues? ❌

1).The one that looms large, and most recent, is the Parity freeze—when a user accidentally triggered a bug in the smart contract of cryptocurrency wallet provider Parity, freezing more than 513,774.16 ETH.

2).A few months before that, in June, Parity’s multisig wallet had already been the target of a hack, where a smart contract vulnerability was exploited to steal 150,000 ethers from user accounts.

3).The grandaddy of all Ethereum hacks, though, has to be The DAO: the distributed autonomous organization comprised of a series of smart contracts intended to democratize how Ethereum projects were funded. In June 2016, The DAO was hacked, and 3.6m Ether (15% of all ether in circulation at the time) was drained from its smart contracts
