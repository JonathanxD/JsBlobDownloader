/**

	JsBlobDownloader
	
	Description:
	 
	This script will be facilitate to the website monitor the download 
	with more precise information, example, you can know if a user has 
	downloaded completely file and the velocity of this download, 
	of course you have to know to do it to measure velocity.
	
    Copyright (C) 2015   JonathanScripter

 	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

 **/

var NewBlob = function(data, datatype) {
	var out;
	try {
		out = new Blob([ data ], {
			type : datatype
		});
	} catch (e) {
		window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder
				|| window.MozBlobBuilder || window.MSBlobBuilder;
		if (e.name == 'TypeError' && window.BlobBuilder) {
			var bb = new BlobBuilder();
			bb.append(data);
			out = bb.getBlob(datatype);
		} else if (e.name == "InvalidStateError") {
			out = new Blob([ data ], {
				type : datatype
			});
		} else {

		}
	}
	return out;
}
// NewBlob (compatibility): http://stackoverflow.com/a/15335607


function download(file, onFinish, updateProgressBar, mimeType) {
	mimeType = (typeof mimeType !== 'undefined' ? mimeType : 'application/octet-stream');
	var req = new XMLHttpRequest();
	req.onprogress = updateProgressBar;
	req.open('GET', file, true);
	req.responseType = 'arraybuffer';
	req.onload = function(e) {
		if (this.status == 200) {
			var blob = new NewBlob(this.response, mimeType);
			onFinish(window.URL.createObjectURL(blob));
		}
	};
	req.send();
}


