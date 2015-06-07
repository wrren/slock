function Filter() {
	var filter 	= this;
	this.domain	= "";

	getSlackDomain( true, function( domain ) {
		filter.domain = domain;

		getBlockList( domain, function( list ) {
			filter.setList( list );
			filter.observe();
		} );
	} );
}

Filter.prototype.setList = function( list ) {
	this.blocklist = list;
}

Filter.prototype.addBlockMenuItem = function( node ) {
	var filter 	= this;
	var username 	= $( node ).find( 'span.member_name' ).text();
	var blockItem	= $( '<li id="member_block"><a>Block</a></li>' );
	$( node ).find( '#menu_items' ).append( blockItem );
	$( node ).find( '#member_block a' ).click( function( e ) {
		filter.add( username );
		e.preventDefault();
		$( node ).remove();
	} );
}

Filter.prototype.observe = function() {
	var blocklist 		= this.blocklist;
	var filter		= this;
	var messageObserver 	= new MutationObserver( function( mutations ) {
		mutations.forEach( function( mutation ) {
			for( var i = 0; i < mutation.addedNodes.length; i++ ) {
				var node = mutation.addedNodes[i];

				if( node instanceof Element && node.className.includes( 'message' ) ) {
					filter.filter( node, blocklist );
				}
			}
		} );
	} );

	var menuObserver 	= new MutationObserver( function( mutations ) {
		mutations.forEach( function( mutation ) {
			for( var i = 0; i < mutation.addedNodes.length; i++ ) {
				var node = mutation.addedNodes[i];

				if( node instanceof Element && node.id == 'menu' ) {
					filter.addBlockMenuItem( node );
				}
			}
		} );
	} );

	messageObserver.observe( $( '#msgs_div' ).get( 0 ), {
		attributes: false,
		childList: true,
		characterData: false,
		subtree: true
	} );

	menuObserver.observe( $( '#client-ui' ).get( 0 ), {
		attributes: false,
		childList: true,
		characterData: false,
		subtree: false
	} );
}

Filter.prototype.hide = function( node, user ) {
	$( node ).addClass( 'slock-filtered' );
	$( node ).addClass( 'slock-filtered-' + user );
}

Filter.prototype.show = function( user ) {
	$( '.slock-filtered-' + user ).removeClass( 'slock-filtered' );
	$( '.slock-filtered-' + user ).removeClass( 'slock-filtered-' + user );
}

Filter.prototype.filter = function( element, list ) {
	var filter 	= this;
	var sender 	= $( element ).find( '.message_sender' ).text().trim();
	var content	= $( element ).find( '.message_content' ).text();

	if( this.blocklist.indexOf( sender ) != -1 ) {
		this.hide( element, sender );
	}

	$.each( this.blocklist, function( i, user ) {
		if( content.includes( '@' + user ) ) {
			filter.hide( element, user );
		}
	} );
}

Filter.prototype.add = function( user ) {
	var filter 	= this;
	var blocklist 	= this.blocklist;

	if( this.blocklist.indexOf( user ) == -1 ) {
		this.blocklist.push( user );

		$( '.message' ).each( function( i, elem ) {
			filter.filter( elem, blocklist );
		} );

		addUser( filter.domain, user, function() {
			console.log( "Added " + user + " to Block List" );
		} );
	}
	
}

Filter.prototype.remove = function( user ) {
	var index = this.blocklist.indexOf( user );

	if( index != -1 ) {
		this.blocklist.splice( index, 1 );
		this.show( user );
	}
}

var filter = new Filter();

chrome.runtime.onMessage.addListener( function( request, sender, responder ) {
	if( request.added != 'undefined' ) {
		for( var i = 0; i < request.added.length; i++ ) {
			console.log( "Added " + request.added[i] + " to block list" );
			filter.add( request.added[i] ); 
		}
	}

	if( request.removed != 'undefined' ) {
		for( var i = 0; i < request.removed.length; i++ ) {
			filter.remove( request.removed[i] );
		}
	}

	responder( { result: "update received" } );
} );




