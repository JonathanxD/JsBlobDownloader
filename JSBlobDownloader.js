/**

	JsBlobDownloader

	Description:

	This script will be facilitate to the website monitor the download
	with more precise information, example, you can know if a user has
	downloaded completely file and the velocity of this download,
	of course you have to know to do it to measure velocity.

    Copyright (C) 2018   JonathanScripter

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
		out = new Blob(data, {
			type : datatype
		});
	} catch (e) {
		window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder
				|| window.MozBlobBuilder || window.MSBlobBuilder;
		if (e.name == 'TypeError' && window.BlobBuilder) {
			var bb = new BlobBuilder();
			for (i in data) {
				bb.append(i);
			}
			out = bb.getBlob(datatype);
		} else if (e.name == "InvalidStateError") {
			out = new Blob(data, {
				type : datatype
			});
		} else {

		}
	}
	return out;
}
// NewBlob (compatibility): http://stackoverflow.com/a/15335607

function download(file, onFinish, updateProgressBar, mimeType) {
	downloadChunked(file, 1, onFinish, updateProgressBar, mimeType);
}

function downloadChunkedBySize(file, size, onFinish, updateProgressBar, mimeType) {
	new Promise(resolve => {
	  var xhr = new XMLHttpRequest();
	  xhr.open('GET', file, true);
	  xhr.onreadystatechange = () => {
	      resolve(+xhr.getResponseHeader("Content-Length"));
	      xhr.abort();
	  };
	  xhr.send();
	}).then(file_size => {            
            downloadChunkedSized(file, parseInt(file_size / size, 10), file_size, onFinish, updateProgressBar, mimeType);
        });
}


function downloadChunked(file, chunks, onFinish, updateProgressBar, mimeType) {
	mimeType = (typeof mimeType !== 'undefined' ? mimeType : 'application/octet-stream');
	new Promise(resolve => {
	  var xhr = new XMLHttpRequest();
	  xhr.open('GET', file, true);
	  xhr.onreadystatechange = () => {
	      resolve(+xhr.getResponseHeader("Content-Length"));
	      xhr.abort();
	  };
	  xhr.send();
	}).then(file_size => {
            downloadChunkedSized(file, chunks, file_size, onFinish, updateProgressBar, mimeType);
	});
}

function downloadChunkedSized(file, chunks, fileSize, onFinish, updateProgressBar, mimeType) {
    var blob = null;
    var size = 0;
    var downloaded = 0;
    var currentChunk = 1;

    var size_per_chunk = parseInt(fileSize / chunks, 10);

    function retryDownload() {
            setTimeout(tryDownload, 2000);
    }

    var updater = function(evt) {
            var prog = function() {};
            prog.lengthComputable = evt.lengthComputable;
            prog.loaded = evt.loaded + size;
            prog.total = fileSize;
            updateProgressBar(prog);
    }

    function tryDownload() {
            try {
                    var req = new XMLHttpRequest();
                    req.timeout = 10000;
                    req.onprogress = updater;
                    req.open('GET', file, true);
                    var range = "";

                    if (currentChunk == chunks) {
                            range = size + "-";
                    } else {
                            range = size + "-" + (size_per_chunk * currentChunk);
                    }
                    req.setRequestHeader("Range", "bytes="+range);
                    req.overrideMimeType(mimeType);

                    req.responseType = 'arraybuffer';
                    req.onload = function(e) {
                            if (this.readyState == 4 && req.response) {
                                    try {
                                            if (blob) {
                                                    blobb = new NewBlob([this.response], mimeType);
                                                    size += blobb.size;
                                                    blob = new NewBlob([blob, blobb], mimeType);
                                            } else {
                                                    blob = new NewBlob([this.response], mimeType);
                                                    size += blob.size;
                                            }

                                            if (currentChunk == chunks) {
                                                    onFinish(window.URL.createObjectURL(blob));
                                            } else {
                                                    currentChunk++;
                                                    tryDownload();
                                            }
                                    } catch (e) {
                                            retryDownload();
                                    }
                            }
                    };
                    req.onreadystatechange = function() {
                            if (req.readyState == 4 && !req.response) {
                                    retryDownload();
                            }
                    };
                    req.send();
            } catch(e) {
                    retryDownload();
            }
    }
    tryDownload();
}
