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

	chrome.storage.sync.get( { 
		key: []
	}, function( items ) {
		callback( items[key] );
	} );
}

/**
 *	Get the user block list for the specified domain
 */
function setBlockList( domain, list, callback ) {
	var key = getDomainKey( domain );

	chrome.storage.sync.set( { 
		key: list
	}, callback );
}

/**
 *	Remove the specified user from the given domain's block list
 */
function removeUser( domain, user ) {
	getBlockList( domain, function( list ) {
		var index = list.indexOf( user );

		if( index != -1 ) {
			list.splice( index, 1 );
			setBlockList( domain, list, function(){} );
		}
	} );
}

/**
 *	Add the specified user to the given domain's block list
 */
function addUser( domain, user ) {
	getBlockList( domain, function( list ) {
		var index = list.indexOf( user );

		if( index == -1 ) {
			list.push( user );
			setBlockList( domain, list, function(){} );
		}
	} );
}