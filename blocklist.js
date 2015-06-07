/**
 *	Add a slack domain to the domain list
 */
function addDomain( domain, callback ) {
	getDomains( function( domains ) {
		if( domains.indexOf( domain ) == -1 ) {
			domains.push( domain );
		}
		setDomains( domains, callback );
	} );
}

/**
 *	Set the domain list
 */
function setDomains( domains, callback ) {
	chrome.storage.sync.set( {
		domains: domains
	}, callback );
}

/**
 *	Get a list of registered slack domains
 */
function getDomains( callback ) {
	chrome.storage.sync.get( {
		domains: []
	}, function( items ) {
		callback( items.domains );
	} );
}

/**
 *	Generate a block list sync key for the given domain
 */
function getDomainKey( domain ) {
	return domain + '_block';
}

/**
 *	Get the user block list for the specified domain
 */
function getBlockList( domain, callback ) {
	var key = getDomainKey( domain );

	chrome.storage.sync.get( key, function( items ) {
		if( key in items ) {
			callback( items[key] );
		} else {
			callback( [] );
		}		
	} );
}

/**
 *	Get the user block list for the specified domain
 */
function setBlockList( domain, list, callback ) {
	var key 	= getDomainKey( domain );
	var obj 	= {};
	obj[key] 	= list;
	chrome.storage.sync.set( obj, callback );
}

/**
 *	Remove the specified user from the given domain's block list
 */
function removeUser( domain, user, callback ) {
	getBlockList( domain, function( list ) {
		var index = list.indexOf( user );

		if( index != -1 ) {
			list.splice( index, 1 );
			setBlockList( domain, list, callback );
		}
	} );
}

/**
 *	Add the specified user to the given domain's block list
 */
function addUser( domain, user, callback ) {
	getBlockList( domain, function( list ) {
		var index = list.indexOf( user );

		if( index == -1 ) {
			list.push( user );
			setBlockList( domain, list, function(){} );
		}

		callback( list );
	} );
}

/**
 *	Given a slack URL, parse the company domain and send it to the given callback
 */
function parseSlackDomain( url, callback ) {
	var parts 	= url.split( '.' );
	var sub 	= parts[0];
	var schema 	= sub.lastIndexOf( '/' );

	if( schema == -1 ) {
		callback( sub );
	} else {
		callback( sub.substr( schema + 1 ) );
	}
}

/**
 *	Get the slack domain of the current page	
 */
function getSlackDomain( local, callback ) {
	if( local ) {
		parseSlackDomain( window.location.href, callback );
	} else {
		chrome.tabs.query({
    			active: true,
    			lastFocusedWindow: true
		}, function( tabs ) {
	   		parseSlackDomain( tabs[0].url, callback );
		});	
	}

	
}