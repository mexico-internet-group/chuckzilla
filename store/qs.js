global.qs = {
    parse: function(location){
        if(location === '') return {};
		if(location[0] === '?' || location[0] === '&') location = location.slice(1);
        var pairs = location.split('&');
        var result = {};
        pairs.forEach(function(pair) {
            pair = pair.split('=');
            result[pair[0]] = decodeURIComponent(pair[1] || '');
        });
        return result;
    },
    stringify: function(obj) {
        var str = $.map(obj, function(val, key){
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        });

        str = str.join("&");
        return str;
    }
};
