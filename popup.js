// popup.js
$(function() {
    
    $(document).ready(function() {
        chrome.runtime.sendMessage({action: 'login'}); //switches view if needed
    });
    
    document.getElementById("submitLoginForm").onclick = function() {
		let username = $('input[name=username]').val();
        let password = $('input[name=password]').val();
        chrome.storage.sync.set({username, password}, function() {
          alert('Settings saved');
          chrome.runtime.sendMessage({action: 'login'});
        });
	};
    
    setView = function(view) {
        switch(view) {
            case 'login':
                $('#loginForm').show();
                $('#frontPage').hide();
                break;
            case 'home':
                $('#frontPage').show();
                $('#loginForm').hide();
                loadEmail();
                loadRooster();
                loadBlackboard();
                break;
        }
    }
    
    loadEmail = function() {
        chrome.runtime.sendMessage({
			action: 'xhttp',
			method: 'post',
			url: "https://portal.ru.nl/nl/c/portal/render_portlet?p_l_id=6828682&p_p_id=radboudexchangeportlet_WAR_RadboudExchangePortletportlet",
		}, function(response) {
            $('#widgetEmail').html(response);
		});
    }
    
    loadRooster = function() {
        chrome.runtime.sendMessage({
			action: 'xhttp',
			method: 'post',
			url: "https://portal.ru.nl/nl/c/portal/render_portlet?p_l_id=6828682&p_p_id=roosterviewer_WAR_roosterviewerportlet",
		}, function(response) {
            $('#widgetRooster').html(response);
		});
    }

    loadBlackboard = function(response) {
        chrome.runtime.sendMessage({
			action: 'xhttp',
			url: 'https://portal.ru.nl/nl/group/home/studentportal'
		}, function(response) {
            let content = $("#portlet_blackboard_WAR_blackboardportlet", response).html();
            chrome.runtime.sendMessage({
                action: 'badge',
                text: '5'
            });
            $('#widgetBlackboard').html(content);
		});
    }
    
    chrome.runtime.onMessage.addListener(function(request, sender, callback) {
        switch(request.action) {
            case 'setView':
                setView(request.text);
                break;
        }
    });
});

