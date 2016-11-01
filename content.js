chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.type) {
        case "save_high":
			window.open(message.vids[0],'_blank');
			break;
		case "save_low":
			window.open(message.vids[1],'_blank');
			break;
		case "save_audio":
			window.open(message.vids[2],'_blank');
			break;
		case "search":
			
			break;
    }
});
