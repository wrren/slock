function Filter() {
	this.blacklist = [];
}

Filter.prototype.observe = function() {
	var blacklist 	= this.blacklist;
	var filter	= this;
	var observer = new MutationObserver( function( mutations ) {
		mutations.forEach( function( mutation ) {
			for( var i = 0; i < mutation.addedNodes.length; i++ ) {
				var node = mutation.addedNodes[i];

				if( node instanceof Element && node.className.includes( 'message' ) ) {
					filter.filter( node, blacklist );
				}
			}
		} );
	} );

	observer.observe( $( '#msgs_div' ).get( 0 ), {
		attributes: false,
		childList: true,
		characterData: false,
		subtree: true
	} );
}

Filter.prototype.filter = function( element, list ) {
	var sender = $( element ).find( '.message_sender' ).text().trim();

	if( blacklist.indexOf( sender ) != -1 ) {
		$( node ).addClass( 'slock-filtered' );
		$( node ).addClass( 'slock-filtered-' + sender );
	}
}

Filter.prototype.add = function( user ) {
	var filter 	= this;
	var blacklist 	= this.blacklist;

	if( this.blacklist.indexOf( user ) == -1 ) {
		this.blacklist.push( user );

		$( '.message' ).each( function( i, elem ) {
			filter.filter( elem, blacklist );
		} );
	}
	
}

Filter.prototype.remove = function( user ) {
	var index = this.blackList.indexOf( user );

	if( index != -1 ) {
		this.blacklist.splice( index, 1 );
		$( '.slock-filtered-' + user ).removeClass( 'slock-filtered' );
	}
}

chrome.runtime.sendMessage( { command: 'blacklist' }, function( response ) {

} );




