import fs from "fs";
import formidable from "formidable";
import fetch from "node-fetch";
import * as CloudmersiveVirusApiClient from "cloud-mesersive-api-client";

function runVirusScan(req, res, next) {
	console.log(CloudmersiveVirusApiClient)
	const defaultClient = CloudmersiveVirusApiClient.ApiClient.instance;
	const Apikey = defaultClient.authentications['Apikey'];
	Apikey.apiKey = "42c090e0-e728-47a0-b2a8-7f8e17972e79";
	const apiInstance = new CloudmersiveVirusApiClient.ScanApi();
	const inputFile = fs.readFileSync(req.files.file.filepath);
	const callback = function(error, data, response) {
		if (error) {
			console.error(error);
		} else {
			console.log('API called successfully. Returned data: ' + data);
			res.send(data);
		}
	}
	apiInstance.scanFile(Buffer.from(inputFile.buffer), callback); 
}

export default runVirusScan;