function updateActiveTab(tabs){
    function updateTab(tabs){
        if(tabs[0]){
            currentTab = tabs[0];
			var re = /https?:\/\/(\w+\.)?pornhub.com\/view_video\.php\?(.+)?viewkey=(\w+)/i;
			var result = re.exec(currentTab.url);
			if(result != null){
				browser.browserAction.enable();
            }else{
                browser.browserAction.disable();
            }
        }
    }
	
    var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then(updateTab);
}

browser.browserAction.onClicked.addListener(function(){
	//console.log('onClicked start');
	
	function onExecuted(result){
		//console.log('onExecuted: ' + result[0]);
		
		var downloadUrl = result[0];
		if(downloadUrl !== false){
			browser.runtime.getPlatformInfo().then((info) => {
				//console.log(info.os);
				if(info.os == 'android'){
					var creating = browser.tabs.create({
						url: downloadUrl
					});
					creating.then(onCreated, onError);
					
				}else{
					browser.downloads.download({
						url : downloadUrl
					});
				}
			});
		}else{
			console.log('Video not found!');
		}
	}

	function onError(error) {
		console.log(`Error: ${error}`);
	}
	
	function onCreated(tab) {
		console.log(`Created new tab: ${tab.id}`)
	}
	
	//console.log('executeScript');
	var executing = browser.tabs.executeScript({
		file: 'ph-load.js'
	});
	executing.then(onExecuted, onError);
});

// listen to tab URL changes
browser.tabs.onUpdated.addListener(updateActiveTab);

// listen to tab switching
browser.tabs.onActivated.addListener(updateActiveTab);

// listen for window 
if(typeof browser.windows !== 'undefined'){
	browser.windows.onFocusChanged.addListener(updateActiveTab);
}

// update when the extension loads initially
updateActiveTab();