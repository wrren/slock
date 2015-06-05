var blocklist = [];

function update( added, removed ) {
	chrome.tabs.query( { url: "https://*.slack.com/messages*" }, 
		function( tabs ) {
			$.each( tabs, function( i, tab ) {
				chrome.tabs.sendMessage( tab.id, { added: added, removed: removed }, function( response ) {
    					console.log( response.result );
				} );	
  		} );
	} );
}

$( '#add-button' ).click( function( e ) {
	var user = $( '#add-input' ).val().trim();

	if( user.length > 0 ) {
		var exists = false;

		$( '#block-list li' ).each( function( i, elem ) {
			if( $( elem ).text() == user ) {
				exists = true;
			}
		} );

		if( !exists ) {
			$( '#block-list' ).append( "<li>" + user + "</li>" );

			blocklist.push( user );

			chrome.storage.sync.set({
				blocklist: blocklist
			}, function() {
				update( [ user ], [] );
			} );
		}
	}

	e.preventDefault();
} );

function populate() {
	chrome.storage.sync.get( {
		blocklist: []
	}, function( items ) {
		$( '#block-list' ).empty();

		$.each( items.blocklist, function( i, user ) {
			$( '#block-list' ).append( "<li>" + user + "</li>" );
		} );

		blocklist = items.blocklist;
	} );
}

populate();