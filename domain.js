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

function populate() {
	getBlockList( domain, function( list ) {
		$( '#block-list' ).empty();

		$.each( list, function( i, user ) {
			$( '#block-list' ).append( "<button data-user='" + user + "'>Unblock " + user + "</button>" );
		} );

		$( '#block-list' ).find( 'button' ).click( function( e ) {
			var user = $( e.target ).data( 'user' );
			removeUser( domain, user, function()
			{
				update( [], [ user ] );
				populate();
			} );
			e.preventDefault();
		} );

		blocklist = list;
	} );
}

getSlackDomain( false, function( d ) {
	domain = d;
	populate();
});