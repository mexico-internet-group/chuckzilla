'use strict';

const sha256 = require('js-sha256').sha256;
const apiKey = '8bec30a7-407b-404d-bd4c-32c79ccf6b5d';
const secret = '4a6d8eb8-589d-45e0-a4b4-1c2e60503400';

Number.prototype.padLeft = function(base, chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

module.exports = function(){
	var d = new Date();
	var dateFormat = '';

	dateFormat += [d.getUTCFullYear(), d.getUTCDate().padLeft(), (d.getUTCMonth()+1).padLeft()].join('-') + 'T';
	dateFormat += [d.getUTCHours().padLeft(), d.getUTCMinutes().padLeft(), d.getUTCSeconds().padLeft()].join(':') + 'Z';

	var signature = apiKey + ',' + secret + ',' + dateFormat;
	var hash = sha256(signature);

	return {
		apiKey: apiKey,
		date: dateFormat,
		hash: hash
	};
};
