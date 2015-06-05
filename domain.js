var blocklist 	= [];
var domain 	= "";

function update( added, removed ) {
	chrome.tabs.query( { url: "https://" + domain + ".slack.com/messages*" }, 
		function( tabs ) {
			$.each( tabs, function( i, tab ) {
				chrome.tabs.sendMessage( tab.id, { added: added, removed: removed }, function( response ) {} );	
  		} );
	} );
}

$( '#add-button' ).click( function( e ) {
	var user = $( '#add-input' ).val().trim();

	if( user.length > 0 ) {
		addUser( domain, user, function( added ) {
			update( added, [] );
			populate();
		} );
	}

	e.preventDefault();
} );

function populate() {
	getBlockList( domain, function( list ) {
		$( '#block-list' ).empty();

		$.each( list, function( i, user ) {
			$( '#block-list' ).append( "<li>" + user + "</li>" );
		} );

		blocklist = list;
	} );
}

getSlackDomain( false, function( d ) {
	domain = d;
	populate();
});