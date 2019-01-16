

// Import libraries we need.
//import {default as Web3} from "web3-cmt";
import {showDoing, showMsg} from "./utils"

export function callContract(contractMethod, p1) {
  return new Promise((resolve, reject) => {
    contractMethod.call(p1, function (err, result) {
      if (err) {
        return
      }
      resolve(result)
    })
  })
}

export function sendTransaction (rawTx) {
  return new Promise((resolve, reject) => {
    web3.cmt.sendTransaction(rawTx, (err, hash) => {
      if (err) {
        console.error("sendTransaction", err)

        if (err.message === "Error: MetaMask Tx Signature: User denied transaction signature.") {
          showMsg("You have refused to send the transaction !!!")
        } else {
          showMsg("Failed to send transaction, please refresh the page and try again !!!")
        }
        //showMsg(err)
        //reject(err);
      } else {
        showMsg("Creating contract ......<br>" + hash)

        resolve(hash)
      }
    })
  })
}

export function getTransactionReceipt (hash) {
  return new Promise((resolve, reject) => {
    web3.cmt.getTransactionReceipt(hash, function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export function getAccounts(){
  return new Promise((resolve, reject) => {
    web3.cmt.getAccounts(function (err, res) {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

export async function waitForTransactionReceipt(hash, callback) {
  let receipt = await getTransactionReceipt(hash)
  //console.log("waitForTransactionReceipt", !receipt,receipt)
  // If no receipt, try again in 1s
  if (!receipt) {
    setTimeout(() => {

      showDoing(true)
      console.log('-----setTimeout-----', !receipt, new Date().getTime())
      receipt = waitForTransactionReceipt(hash, callback)
    }, 1000)
  } else if(receipt.status === "0x1"){
    console.log('----receipt----',receipt,!receipt)
    callback(null, receipt)
    showDoing()
  }else if(receipt.status === "0x0"){
    console.log('----receipt----',receipt,!receipt)
    callback("error", null)
    showDoing()
  }
}



export function getVoteOption (contract, index) {
  return new Promise((resolve, reject) => {
    contract.options.call(index, function (err, voteOption) {
      if (err) {
        reject(err)
        return
      }
      resolve(voteOption)
    })
  })
}

export function getTitle (contract) {
  return new Promise((resolve, reject) => {
    contract.title.call(function (err, voteTitle) {
      if (err) {
        return
      }
      resolve(voteTitle)
    })
  })
}

export function getVoteResult (contract, index) {
  return new Promise((resolve, reject) => {
    contract.result.call(index, function (err, voteResult) {
      if (err) {
        return
      }
      resolve(voteResult)
    })
  })
}

export function verifyIsVoted(contract, currentAccount) {
  console.log("verifyIsVoted currentAccount", currentAccount)
  return new Promise((resolve, reject) => {
    contract.addressVote.call(currentAccount, function (err, verifyResult) {
      if (err) {
        return
      }
      resolve(verifyResult)
    })
  })
}



export function initWeb3(callback){

  try{
    console.info("web3 init ...")

    // Is there an injected web3 instance?
    if (typeof web3 !== "undefined") {
      console.warn("Using web3 detected from external source like Metamask")
      // If there is a web3 instance(in Mist/Metamask), then we use its provider to create our web3object


      // window.web3 = new Web3(web3.currentProvider)


    // } else if(web3Url && web3User && web3Password) {
    //   console.info("web3Url with pwd:"+web3Url)
    //   // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //   // window.web3 = new Web3(new Web3.providers.HttpProvider(web3Url, 0, web3User, web3Password))
    // } else if(web3Url){
    //   console.info("web3Url no pwd:"+web3Url)
    //   // window.web3 = new Web3(new Web3.providers.HttpProvider(web3Url))
    }

    console.info("web3 init", web3)
  }catch (e) {
    console.warn("web3 init error:", e)
    showMsg("web3cmt checking ... ")
  }

  if(!window.web3){
    setTimeout(function(){
      initWeb3(callback)
    }, 1000)
  }else{
    showMsg("web3cmt ok. ")
    try{
      callback()
    }catch (e) {
      console.warn("web3 init callback error:", e)
    }
  }

}


// function getWeb3Config(){
//
//   const chainType = $("#sel_chain_type").val();
//   if(chainType==='mainnet'){
//     web3Url = "http://rpc.cybermiles.io:8545"
//   }else if(chainType==='testnet'){
//     web3Url = "http://testnet-rpc.cybermiles.io:8545/"
//   }
//
// }

// function initChainType(){
//
//   $("#sel_chain_type").append("<option value='metamask'>Metamask</option>");
//   $("#sel_chain_type").append("<option value='mainnet'>Mainnet</option>");
//   $("#sel_chain_type").append("<option value='testnet'>Testnet</option>");
//
//   $("#sel_chain_type").change(function(el){
//     //getWeb3Config();
//     window.localStorage.setItem("sel_chain_type", $("#sel_chain_type").val())
//     location.reload()
//   })
//
//   const selected = window.localStorage.getItem("sel_chain_type");
//   if(selected){
//     $("#sel_chain_type").find("option[value='"+selected+"']").attr("selected",true);
//   }
//
// }
