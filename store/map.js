global.map = function( elems, callback, arg ) {
    var value, i = 0, length = elems.length, isArray = Array.isArray( elems ), ret = [];
    if ( isArray ) {
        for ( ; i < length; i++ ) {
            value = callback( elems[ i ], i, arg );
            if ( value != null ) {
				ret.push( value );
            }
        }

    }
    else {
        for ( i in elems ) {
            value = callback( elems[ i ], i, arg );
            if ( value != null ) {
				ret.push( value );
            }
        }
    }
    return [].concat.apply( [], ret );
};