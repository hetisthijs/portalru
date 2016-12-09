$(function() {
    chrome.runtime.sendMessage({action: 'login'}); //switches view if needed
    
    $('#logout').click(function() {
        chrome.runtime.sendMessage({action: 'logout'});
    });
    
    $('#login').click(function() {
        let username = $('input[name=username]').val();
        let password = $('input[name=password]').val();
        chrome.storage.sync.set({username, password}, function() {
          chrome.runtime.sendMessage({action: 'login'});
        });
    });
    
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
                $('#alert').hide();
                loadBlackboard();
                loadRooster();
                loadEmail();
                break;
        }
    };
    
    dayToNL = function(text, number) {
        let today = new Date().getDate();
        let eng = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        let short = ['ma', 'di', 'wo', 'do', 'vr'];
        let dutch = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];
        if (number == today)
            return 'vandaag';
        if (number == today+1)
            return 'morgen';
        for (let i = 0; i < eng.length; i++) {
            if (eng[i] === text || short[i] === text)
                return dutch[i];
        }
    };
    
    loadEmail = function() {
        chrome.runtime.sendMessage({
            action: 'xhttp',
            url: "https://portal.ru.nl/nl/c/portal/render_portlet?p_l_id=6828682&p_p_id=radboudexchangeportlet_WAR_RadboudExchangePortletportlet",
        }, function(response) {
            let content = '';
            $(".item", response).each(function(index) {
                let title = $('h4 a', this).text();
                let text = $('h4 a', this).attr('title');
                let from = $('.from', this).text().trim();
                let date = $('.date', this).text().trim();
                content += '<small>'+ date +'</small><div class="email"><a href="http://mail.ru.nl" target="_blank"><b>' + title + ' [' + from + ']</b></a><br /><span class="emailText"><small>' + text + '</small></span></div><hr>';
            });
            $('#widgetEmail').html(content);
            
            $(".email").mouseover(function() {
                $(".emailText", this).slideDown();
            });
        });
    };
    
    loadRooster = function() {
        chrome.runtime.sendMessage({
            action: 'xhttp',
            url: "https://portal.ru.nl/nl/c/portal/render_portlet?p_l_id=6828682&p_p_id=roosterviewer_WAR_roosterviewerportlet",
        }, function(response) {
            let content = '<table id="timetable">';
            $(".event-item", response).each(function() {
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
            $('#widgetBlackboard').html('abc');
            let portlet = $("#portlet_blackboard_WAR_blackboardportlet", response).html();
            let content = '';
            $(".item", portlet).each(function() {
                let title = $('h4', this).html().split(' <span')[0] + '</a>';
                let date = $('.date', this).text().replace('Blackboard','').trim();
                content += '<b>' + title + '</b><br /><small>' + date + '</small><hr>';
            });
            $('#widgetBlackboard').html(content);
            
            if (content.trim() === '') {
                showAlert();
            }
        });
    };
    
    chrome.runtime.onMessage.addListener(function(request, sender, callback) {
        switch(request.action) {
            case 'setView':
                setView(request.text);
                break;
            case 'close':
                self.close();
                break;
        }
    });

    showAlert = function() {
        $('#alert').show();
        $('#alert').click(function() {
            chrome.runtime.sendMessage({action: 'logout'});
        });
    }

});

