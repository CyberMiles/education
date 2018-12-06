pragma lity ^1.2.4;

contract HelloWorld { 

  string helloMessage;
  address public owner;

    modifier onlyOwner() {
        assert(msg.sender == owner);
        _;
    }

    constructor () public {
        helloMessage = "Hello world";
        owner = msg.sender;
    }

  function updateMessage (string _new_msg) public {
        helloMessage = _new_msg;
    }
    
  function sayHello() public returns (string) {
    return helloMessage;
  }

  function terminate() external onlyOwner {
    selfdestruct(owner);
  }
}