pragma lity ^1.2.4;

contract HelloWorld { 

  mapping(address => string) userMessage;
  address public owner;

    modifier onlyOwner() {
        assert(msg.sender == owner);
        _;
    }

    constructor () public {
        userMessage[msg.sender] = "Hello world";
        owner = msg.sender;
    }

  function updateMessage (string _new_msg) public {
        userMessage[msg.sender] = _new_msg;
    }
    
  function sayHello() public view returns (string) {
    return userMessage[msg.sender];
  }
  
  function sayHelloByAddress(address addr) public view returns (string) {
      return userMessage[addr];
  }

  function terminate() external onlyOwner {
    selfdestruct(owner);
  }
}