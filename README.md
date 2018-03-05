JsBlobDownloader
================

This script will save file in blob cache, and this file can be download, or if is a media can be shown/reproduced.



[Examples](http://jsu.zz.mu/jsblobdownloader)


Chunked
================

Since 05/03/2018 (DD/MM/YYYY), JSBlobDownloader supports chunked download (requested by @usherfiles, issue #1), resume is not possible because JSBlobDownloader uses XHR (XMLHttpRequest) which does not allow to retrieve data if download is interrupted (I've considered using Streams API, but it requires to be explicit enabled in Firefox, so, it is not the better choice). However, if the download of chunk 7 is interrupted by the server, the script will retry to download this particular chunk, so the entire data does not need to be downloaded again.

How to use:

```
downloadChunked(file, chunks, onFinish, updateProgressBar);
```

The example 1 and example 4 in the [website](http://jsu.zz.mu/jsblobdownloader) uses this feature, hover on download button and click in `<>` in right side of screen to see the source.
