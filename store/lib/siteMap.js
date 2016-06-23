'use strict';

module.exports = function(db, store, payload, response){
	var xml = '';
	xml += '<?xml version="1.0" encoding="iso-8859-1" ?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';
	xml += '<url><loc>https://hmovil.com</loc><changefreq>weekly</changefreq></url>';
	db.collection('tax').find({},{_id:0}).toArray(function(err, docs){
		var tax = {};
        map(docs,function(val,key){
            if(typeof val.parent === 'undefined' || val.parent === null){
                tax[val.n] = {};
            }
        });
        map(tax,function(val,key){
            map(docs,function(subval,subkey){
                if(subval.parent === key){
                    tax[key][subval.n] = {};
                }
            });
        });
        map(tax,function(val,key){
			xml += '<url><loc>https://hmovil.com/' + key + '</loc><changefreq>weekly</changefreq></url>';
            map(val,function(subval,subkey){
				xml += '<url><loc>https://hmovil.com/' + key + '/' + subkey + '</loc><changefreq>weekly</changefreq></url>';
                map(docs,function(value,index){
                    if(value.parent === subkey){
						xml += '<url><loc>https://hmovil.com/' + key + '/' + subkey + '/' + value.n + '</loc><changefreq>weekly</changefreq></url>';
                        tax[key][subkey][value.n] = null;
                    }
                });
            });
        });
		crawlProducts();
	});


	var crawlProducts = function(){
		db.collection('inventory').find({},{id: 1, department: 1, family: 1, line: 1, displayName: 1}).toArray(function(err, docs){
			map(docs, function(val, key){
				xml += '<url><loc>https://hmovil.com/' + (val.department || 'd') + '/' + (val.family || 'f') + '/' + (val.line || 'l') + '/' + val.displayName.replace(/ /g,'-') + '-' + val.id + '</loc><changefreq>weekly</changefreq></url>';
			});
			xml += '</urlset>';

			response({xml: xml});
		});
	};

};
