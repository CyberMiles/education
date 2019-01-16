// import CSS. Webpack with deal with it
import "../css/style.css"


import {GetRequest, saveLocalStorageForListItem, showMsg, showDoing} from "./utils"
import {initWeb3,  sendTransaction, getTitle, waitForTransactionReceipt, getVoteOption,
  getVoteResult, verifyIsVoted, getAccounts} from "./web3Helper"
import {abi, bytecode} from "./contract"

let currentAccount = null
let initAccount = null
let initValue = null
let contractInstance = null

let dappHost = "";

let Request = GetRequest();

window.App = {
  init: async function () {

    initAccount = "0x0000000000000000000000000000000000000000"
    initValue = "0x0000000000000000000000000000000000000000000000000000000000000000"

    try{
      if(web3 && web3.cmt){
        currentAccount = (await getAccounts())[0]
        contractInstance = web3.cmt.contract(abi)
        console.info("App.init currentAccount", currentAccount)
      }else{
        showMsg("web3 checking ... ")
      }
    }catch (e) {
      console.error("App.init", e)
    }
    console.info("App.init", web3.cmt)

  },

  pageInit: function(){

    // get http param 'contract'
    const contractAddress = Request["contract"]
    console.info("req contract", contractAddress)
    if (contractAddress) {
      App.pageInitResult()

    }else{
      App.pageInitCreate();
    }

  },
  pageInitCreate: function(){

    const html = $("#tmpl_vote_create_page").render({})
    $("#container").html(html)

    $("#btnCreateVote").click(function () {
      try {
        App.createVote()
      } catch (e) {
        console.error("createVote", e)
      }
    })

  },
  pageInitResult: function(){

    const html = $("#tmpl_vote_result_page").render({})
    $("#container").html(html)

  },

  loadData: function(){

    // get http param 'contract'
    const contractAddress = Request["contract"]
    console.info("req contract", contractAddress)
    if (contractAddress) {

      if(contractAddress){

        App.showVoteResult(contractAddress)

      }

    }

  },

  createVote: async function () {

    App.init();
    if(!currentAccount){
      showMsg("Current Account is no found！Try again!", 'warn')
      return
    }

    const title = $("#title").val()
    let options = $("#option").val()

    if (!title || !options) {
      showMsg("Title or option cannot be empty！", 'warn')
      return
    }
    options = options.replace(/，/g,',')

    const optionArray = []
    for (const option of options.split(",")) {
      optionArray.push(web3.toHex(encodeURI(option)))
    }

    console.log("--createVote:params >>>", title, optionArray)

    let contractData = await contractInstance.new.getData(title, optionArray, {data: bytecode})
    let rawTx = {
      from: currentAccount,
      gas: 3000000,
      gasPrice: 2000000000,
      data: contractData,
    }
    console.log("--createVote:rawTx >>>", rawTx)

    showMsg("Please confirm the transaction at Metamask ...")

    const hash = await sendTransaction(rawTx)
    console.log("--createVote:tx hash: " + hash)

    console.log('-----waitForTransactionReceipt-----')
    waitForTransactionReceipt(hash, function(err,receipt){

      const contractAddress = receipt.contractAddress
      if (contractAddress) {
        $("#msg").html("Contract was successfully created !!!")

        const data = {
          address: contractAddress,
          title: title,
          hash: hash
        }

        const html = $("#tmpl_vote_result").render(data)
        $("#createResult").html(html)

        if (contractAddress) {
          $("#votePage").html($("#tmpl_goto_vote").render({dappHost:dappHost, contractAddress:contractAddress}))
        }

        saveLocalStorageForListItem("vote_contract_list", data)
  
      }
    })
    console.log('-----waitForTransactionReceipt-----ok')

    return "ok"
  },
  showVoteResult: async function (contractAddress) {
    try {
      console.log("showVoteResult", contractAddress)
      $("#contractAddress").text(contractAddress)

      const contract = contractInstance.at(contractAddress)
      let index = 0

      const voteResultData = {
        address: contractAddress,
        title: "",
        options: []
      }

      showMsg("loading")

      while (true) {

        showDoing(true)

        const result = await getVoteOption(contract, index)
        if (result === initValue) {
          break
        }
        console.info("getVoteOption result", contractAddress, index, decodeURI(web3.toAscii(result)))

        if(result==="0x"){
          break
        }
        voteResultData.options.push({"option": decodeURI(web3.toAscii(result))})

        if(index>100){
          break
        }
        index++
      }
      // console.log("voteResultData", voteResultData.options)
      for (let i = 0; i < voteResultData.options.length; i++) {
        const score = await getVoteResult(contract, i)
        voteResultData.options[i]["score"] = score.toString()

        showDoing(true)
      }
      // console.log("voteResultData", voteResultData.options)

      const title = await getTitle(contract, contractAddress)
      voteResultData.voteTitle = title;

      showDoing()

      const html = $("#tmpl_vote_list").render(voteResultData)
      $("#voteResult").html(html)

      $("#resultTable").on("click", ".voteBtn", function (e) {
        const option = $(e.target).attr("val")
        App.submitVote(contractAddress, option)
      })

      showMsg("")
      
      await App.verifyAccountVote(contract, currentAccount)

    } catch (e) {
      console.error(e)
      showMsg(e)
    }

  },
  verifyAccountVote: async function (contract, currentAccount) {

    const verifyResult = await verifyIsVoted(contract, currentAccount)
    if (verifyResult[0] === initAccount) {
      showMsg("You can vote to this contract with current account.")
    }
    else {
      showMsg("Warning: You have already voted to this contract !", "warn")

      $(".voteBtn").attr("disabled",true);
    }
  },

  submitVote: async function (contractAddress, index) {

    console.log("currentAccount", currentAccount)

    if (!currentAccount) {
      showMsg("invalid address! (currentAccount=" + currentAccount + ")")
      return
    }

    const contract = contractInstance.at(contractAddress)

    showMsg("Please confirm the transaction at Metamask ...")
    console.log('------index------',index)
    contract.vote.sendTransaction(index, {from: currentAccount, gas: 3000000, gasPrice: 2000000000}, (err, hash) => {
      if (err) {
        if (err.message === "Error: MetaMask Tx Signature: User denied transaction signature.") {
          showMsg("You have refused to send the transaction !!!")
        } else {
          showMsg("Failed to send transaction, please refresh the page and try again !!!")
        }
      } else {
        console.log("tx: " + hash)
        showMsg("Voting ... <br>" + hash)
        waitForTransactionReceipt(hash,function(err,receipt){

          console.log('----vote receipt---',receipt)
          if (receipt) {
            showMsg("");
            $("#voteTxResult").html($("#tmpl_vote_tx_result").render({hash:hash}))

            App.showVoteResult(contractAddress)

          }
        })
      }
    })
  },

}


function getConfig(){

  const env = 'prod';
  // const env = 'dev';
  if(env==='prod' || !env){
    dappHost = "http://dapp.cybermiles.club";
  }else if(env==='dev'){
    dappHost = "http://127.0.0.1:8080";
  }
  console.info("getConfig", env, dappHost)

}


// When the page loads, we create a web3 instance and set a provider. We then set up the app
$(document).ready(function () {

  getConfig();

  App.pageInit();

  initWeb3( async function(){

    await App.init();

    App.loadData();

  });

})











