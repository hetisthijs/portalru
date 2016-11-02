// popup.js
$(function() {
    
    $(document).ready(function() {
        chrome.runtime.sendMessage({action: 'login'}); //switches view if needed
    });
    
    document.getElementById("logout").onclick = function() {
        chrome.runtime.sendMessage({action: 'logout'});
    };
    
    document.getElementById("submitLoginForm").onclick = function() {
		let username = $('input[name=username]').val();
        let password = $('input[name=password]').val();
        chrome.storage.sync.set({username, password}, function() {
          chrome.runtime.sendMessage({action: 'login'});
        });
	};
    
    setView = function(view) {
        switch(view) {
            case 'login':
                $('#loginForm').show();
                $('#logout').hide();
                $('#frontPage').hide();
                break;
            case 'home':
                $('#frontPage').show();
                $('#logout').show();
                $('#loginForm').hide();
                loadEmail();
                loadRooster();
                loadBlackboard();
                break;
        }
    };
    
    dayToNL = function(text, number) {
        let today = new Date().getDate();
        let eng = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        let dutch = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];
        if (number == today)
            return 'vandaag';
        if (number == today+1)
            return 'morgen';
        for (let i = 0; i < eng.length; i++) {
            if (eng[i] === text)
                return dutch[i];
        }
    };
    
    loadEmail = function() {
        chrome.runtime.sendMessage({
			action: 'xhttp',
			url: "https://portal.ru.nl/nl/c/portal/render_portlet?p_l_id=6828682&p_p_id=radboudexchangeportlet_WAR_RadboudExchangePortletportlet",
		}, function(response) {
            $('#widgetEmail').html(response);
		});
    };
    
    loadRooster = function() {
        chrome.runtime.sendMessage({
			action: 'xhttp',
			url: "https://portal.ru.nl/nl/c/portal/render_portlet?p_l_id=6828682&p_p_id=roosterviewer_WAR_roosterviewerportlet",
		}, function(response) {
            let content = '<table id="timetable">';
            $(".event-item", response).each(function(index, element){
                 let title = $('h4', this).html().split(' <span')[0] + '</a>';
                 let dayText = $('.event-date-day-text', this).text().trim();
                 let dayNumber = $('.event-date-day-number', this).text().trim();
                 let time = $('.event-date-time', this).text()
                 let location = $('.event-location', this).text();
                 let description = $('.event-description', this).text();
                 content += '<tr><td><b>'+ dayToNL(dayText, dayNumber) +'</b><br /><small>' + time + '</small></td><td><b>' + title + '</b><br /><small>' + location + ', ' + description + '</small></td>';
            });
            content += '</table>';
            $('#widgetRooster').html(content);
		});
    };

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
    };
    
    chrome.runtime.onMessage.addListener(function(request, sender, callback) {
        switch(request.action) {
            case 'setView':
                setView(request.text);
                break;
        }
    });
});

