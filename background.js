chrome.commands.onCommand.addListener((command) => {
    if (command === "activate_recognition"){
        chrome.tabs.query({active : true, currentWindow : true}, ([tab]) => {
            chrome.scripting.executeScript({
                target : {tabId : tab.id}, 
                files : ["model.js", "app.js"]
            });
        });
    }
})