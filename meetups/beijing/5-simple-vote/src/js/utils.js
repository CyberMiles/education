

export function GetRequest() {
  const url = location.search
  const theRequest = {}

  if (url.indexOf("?") !== -1) {
    const str = url.substr(1)
    const strs = str.split("&")
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1])
    }
  }
  return theRequest
}


export function saveLocalStorageForListItem(key, data) {
  const myStorage = window.localStorage
  let item = myStorage.getItem(key)
  if (!item) {
    item = []
  }
  else {
    item = JSON.parse(item)
  }

  item.push(data)

  myStorage.setItem(key, JSON.stringify(item))
  //console.info("-------myStorage-----", myStorage)
}

export function getLocalStorageForListItem(key) {
  const myStorage = window.localStorage
  let item = myStorage.getItem(key)
  if (!item) {
    item = []
  }
  else {
    item = JSON.parse(item)
  }
  return item
}



export function showMsg(msg, type) {
  if(type==="warn") {
    $("#msg").html("<p class='text-warning'>" + msg + "</p>")
  }else if(type==="error"){
    $("#msg").html("<p class='text-danger'>" + msg + "</p>")
  } else {
    $("#msg").html("<p class='text-info'>" + msg + "</p>")
  }
}

export function showDoing(isAppend) {
  let s = ""
  if(isAppend){
    s = $("#doing").text()+"."
  }else{
    s = ""
  }
  $("#doing").text(s)
}