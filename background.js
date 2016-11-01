let loggedIn = false;
    loginAction = function() {
    //chrome.storage.sync.get(['username','password'], function(object) {
       // console.log(object);
       // let username = object.username;
       // let password = object.password;
        //if (!username || !password) return;
        
        chrome.runtime.sendMessage({
                action: 'xhttp',
                url: 'https://portal.ru.nl/home'
            }, function(response) {
                var elements = $(response);
                var formAction = $('#_58_fm', elements).attr('action');
                var formDate = $('input[name=_58_formDate]', elements).val();
                
                chrome.runtime.sendMessage({
                    action: 'xhttp',
                    method: 'post',
                    url: formAction,
                    data: '_58_formDate='+formDate+'&_58_login=&_58_password='
                }, function(response) {
                    if (response) { //if equals certain value
                        let loggedIn = true;
                    }
                });
            });        
    //});

};

loginAction();
/*
chrome.webRequest.onBeforeRedirect.addListener(function() { //redirect = not logged in
    chrome.storage.sync.get('username', function(details) {
        console.log(details);
      if (details) {
        loginAction();
      } else {
        setView('login');
      }
    });
},{urls: ["https://portal.ru.nl/*"]});

setView = function(view) {
    console.log(view);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ //send new view to content
       chrome.tabs.sendMessage(tabs[0].id, {view: view}, function(response) {}); 
    });
}*/

/*
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    var type = details.type;
    if(type == 'xmlhttprequest') {
        if (!loggedIn) {
            requireLogin();
        }
    }

    /*
		var url = details.url;
		
    
});
*/
/*
chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details) {
		var url = details.url;
		for (var i = 0; i < details.requestHeaders.length; ++i) {
			if (details.requestHeaders[i].name === 'Origin' || details.requestHeaders[i].name === 'X-DevTools-Emulate-Network-Conditions-Client-Id' || details.requestHeaders[i].name === 'User-Agent') { //leaks extension
				details.requestHeaders[i].name = "Access-Control-Allow-Origin";
				details.requestHeaders[i].value = "*";
			}
		}
		return {requestHeaders: details.requestHeaders};
    },
    {urls: ["https://portal.ru.nl/*"]},
    ["blocking", "requestHeaders"]
);
*/

/*
$(document).ready(function() {
	views = chrome.extension.getViews({type: "popup"});
	for (var i = 0; i < views.length; i++) {
		var v = views[i];
		var iframe = v.createElement('iframe');
		
		alert(data);
    }
});*/

// listening for an event / one-time requests
// coming from the popup
/**
 * Possible parameters for request:
 *  action: "xhttp" for a cross-origin HTTP request
 *  method: Default "GET"
 *  url   : required, but not validated
 *  data  : data to send in a POST request
 *
 * The callback function is called upon completion of the request */
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    switch(request.action) {
        case 'login':
            if (!loggedIn)
                loginAction();
            break;
        case 'badge':
            chrome.browserAction.setBadgeText({text: request.text});
            chrome.browserAction.setBadgeBackgroundColor({color: 'red'});
            break;
        case 'xhttp':
            var xhttp = new XMLHttpRequest();
            var method = request.method ? request.method.toUpperCase() : 'GET';

            xhttp.onload = function() {
                callback(xhttp.responseText);
            };
            xhttp.onerror = function(err) {
                // Do whatever you want on error. Don't forget to invoke the
                // callback to clean up the communication port.
                callback();
            };
            xhttp.open(method, request.url, true);
            xhttp.withCredentials = true;
            if (method == 'POST') {
                xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            xhttp.send(request.data);
            return true; // prevents the callback from being called too early on return
            break;
    }
});

        
 
 
// send a message to the content script
var sendToContent = function(reqtype) {
	/*
    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendMessage(tab.id, {type: reqtype, vids: VIDS});
        // setting a badge
        chrome.browserAction.setBadgeText({text: "red!"});
    });
    */
}
