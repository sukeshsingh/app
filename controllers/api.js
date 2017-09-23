var express = require('express'),
	router = express.Router();
var fs = require('fs');
var azure = require('azure-storage');



router.get('/', function (req, res) {
	var remoteAddress = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress;

	var account = 'ntttransformersstrg';
	var key = 'nBHAxxjGSsCCC/2hsmeUYm1lGCrAfiGR5BdfkDW9s1OKThuX6IBgf+q0EbH3c6lYVBQV09dsHGWXxUvpyF807Q==';


	fs.writeFile("controllers/iplog.txt", remoteAddress, function (err) {
		if (err) {
			return console.log(err);
		}

		console.log("The file was saved!");
	});

	var blobService = azure.createBlobService(account, key).withFilter(new azure.ExponentialRetryPolicyFilter());
	blobService.createContainerIfNotExists('taskcontainer', {
		publicAccessLevel: 'blob'
	}, function (error, result, response) {
		if (!error) {
			console.log("container was created: ", result);
			// if result = true, container was created.
			// if result = false, container already existed.
		}
	});

	blobService.createBlockBlobFromLocalFile('taskcontainer', 'taskblob', 'iplog.txt', function (error, result, response) {
		if (!error) {
			// file uploaded
			console.log("file uploaded: ", result);
		}
	});
	return res.json({
		"ipaddress": remoteAddress
	});
	//return	res.json({'users':'ALL'}); 
});

//router.get('/:id', function(req, res) {
//	res.json({'user_id':req.params.id}); 
//});

module.exports = router;