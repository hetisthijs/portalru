// popup.js
$(function() {
    loginSubmit = function() {
        let username = $('input[name=username]').val();
        let password = $('input[name=password]').val();
        chrome.storage.sync.set({'username': username, 'password': password}, function() {
          message('Settings saved');
          chrome.runtime.sendMessage({action: 'login'});
        });
    }
	
    $(document).ready(function() {
        chrome.runtime.sendMessage({action: 'login'});
    });
    
	document.getElementById("emails").onclick = function() {
		viewEmails();
	};
    document.getElementById("blackboard").onclick = function() {
		viewBlackboard();
	};
    document.getElementById("rooster").onclick = function() {
		viewRooster();
	};
    
    viewEmails = function() {
        chrome.runtime.sendMessage({
			action: 'xhttp',
			method: 'post',
			url: "https://portal.ru.nl/nl/c/portal/render_portlet?p_l_id=6828682&p_p_id=radboudexchangeportlet_WAR_RadboudExchangePortletportlet",
		}, function(response) {
            showContent(response);
		});
    }
    
    viewRooster = function() {
        chrome.runtime.sendMessage({
			action: 'xhttp',
			method: 'post',
			url: "https://portal.ru.nl/nl/c/portal/render_portlet?p_l_id=6828682&p_p_id=roosterviewer_WAR_roosterviewerportlet",
		}, function(response) {
            showContent(response); 
		});
    }

    viewBlackboard = function(response) {
        chrome.runtime.sendMessage({
			action: 'xhttp',
			url: 'https://portal.ru.nl/nl/group/home/studentportal'
		}, function(response) {
            let content = $("#portlet_blackboard_WAR_blackboardportlet", response).html();
            chrome.runtime.sendMessage({
                action: 'badge',
                text: '5'
            });
            showContent(content);
		});
    }
	
	getContents = function() {
		//$('#wv').attr('src', 'https://portal.ru.nl/group/home/studentportal');
		var contents = $('#wv').contents().find("html").html();
		console.log(contents);
		alert(contents);
		/*
		chrome.runtime.sendMessage({
			action: 'xhttp',
			url: 'https://portal.ru.nl/nl/group/home/studentportal'
		}, function(response) {
			
			var elements = $(response);
			
			var blackboard = $('.item > a', elements).attr('href');
			alert(blackboard);
			window.open(blackboard, '_blank');
		});
		*/
	}
    
    showContent = function(response) {
        $('#content').html(response);
    }
});

