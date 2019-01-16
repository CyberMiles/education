pragma lity ^1.2.4;

contract VoteExample {
    
    address public owner;

    //title 
    string public title;
    //options 
    mapping(uint => bytes32) public options;
    //result
    mapping(uint => uint) public result;
    
    modifier onlyOwner() {
        assert(msg.sender == owner);
        _;
    }
    
    mapping(address => AddressVote) public addressVote;
    
    struct AddressVote{
        address account;
        bool hasVoted;
        uint voteTo;
    }
    
    constructor (string _title, bytes32[] _options) public {
        owner = msg.sender;
        title = _title;
        initOptions(_options);
    }

    function initOptions(bytes32[] _options){
        for(uint i=0 ; i < _options.length ; i++){
            options[i] = _options[i];
        }
    }
    function vote(uint _option){
       require(verifyAddress(msg.sender) == false);
       result[_option] = result[_option] + 1 ;
       addressVote[msg.sender] = AddressVote(msg.sender,true,_option);
    }
    function verifyAddress(address _account) returns (bool){
        AddressVote result = addressVote[_account];
        if(result.hasVoted == false){
             return false;
        }else{
            return true;
        }
       
    }

}

