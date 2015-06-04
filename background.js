chrome.runtime.onInstalled.addListener( function() {
	chrome.declarativeContent.onPageChanged.removeRules( undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules( [
		{
			// If we're looking at domain.slack.com...
			conditions: [
				new chrome.declarativeContent.PageStateMatcher( {
					pageUrl: { urlContains: ".slack.com" }
				} )
			],

			// Show the page action
			actions: [ new chrome.declarativeContent.ShowPageAction() ]
		} ]);
	} );
} );