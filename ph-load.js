function searchVideo(videoId){
	//console.log(videoId);
	
	var flashvars = window.wrappedJSObject['flashvars_' + videoId];
	var qualityItems = window.wrappedJSObject['qualityItems_' + videoId];
	var video240 = false;
	var video480 = false;
	var video720 = false;
	var video1080 = false;
	
	//console.log(flashvars);
	//console.log(qualityItems);

	if(typeof qualityItems !== 'undefined'){
		for(var i = 0, len = qualityItems.length; i < len; i++){
			var media = qualityItems[i];
			
			//console.log(media);
			
			if(media.text == '240p'){
				video240 = media.url;
			}else if(media.text == '480p'){
				video480 = media.url;
			}else if(media.text == '720p'){
				video720 = media.url;
			}else if(media.text == '1080p'){
				video1080 = media.url;
			}
		}
	}
	if(typeof flashvars !== 'undefined'){
		if(typeof flashvars.mediaDefinitions !== 'undefined'){
			for(var i = 0, len = flashvars.mediaDefinitions.length; i < len; i++){
				var media = flashvars.mediaDefinitions[i];
				
				//console.log(media);
				
				if(media.format == 'mp4'){
					if(media.quality == '240'){
						video240 = media.videoUrl;
					}else if(media.quality == '480'){
						video480 = media.videoUrl;
					}else if(media.quality == '720'){
						video720 = media.videoUrl;
					}else if(media.quality == '1080'){
						video1080 = media.videoUrl;
					}else if(Array.isArray(media.quality) && media.videoUrl.includes('get_media')){
						httpRequest = new XMLHttpRequest();
						if(!httpRequest){
							console.log('Giving up :( Cannot create an XMLHTTP instance');
						}else{
							httpRequest.open('GET', media.videoUrl, false);
							httpRequest.send();
							if(httpRequest.status != 200){
								console.log( httpRequest.status + ': ' + httpRequest.statusText );
							} else {
								mediaInfo = JSON.parse(httpRequest.responseText);
								
								//console.log(mediaInfo);
								
								for(var i = 0, len = mediaInfo.length; i < len; i++){
									var media = mediaInfo[i];
									
									//console.log(media);
									
									if(media.quality == '240'){
										video240 = media.videoUrl;
									}else if(media.quality == '480'){
										video480 = media.videoUrl;
									}else if(media.quality == '720'){
										video720 = media.videoUrl;
									}else if(media.quality == '1080'){
										video1080 = media.videoUrl;
									}
								}
							}
						}
					}
				}
			}
			
			if(video1080 != false){
				return video1080;
			}else if(video720 != false){
				return video720;
			}else if(video480 != false){
				return video480;
			}else if(video240 != false){
				return video240;
			}
		}
	}
	return false;
}

var flashvarsString;
var video = false;
var player = document.getElementById('videoShow');

if(player !== null){
	var videoElements = player.getElementsByTagName('video-element');
	if(videoElements !== null){
		flashvarsString = videoElements[0].firstChild.id;
	}
}

if(typeof flashvarsString !== 'undefined' && typeof flashvarsString !== 'number'){
	flashvarsString = flashvarsString.replace('playerDiv_', '');
}
else{
	var videoShow = window.wrappedJSObject['VIDEO_SHOW'];
	if(typeof videoShow.video_id !== 'undefined'){
		flashvarsString = videoShow.video_id;
	}
	else{
		flashvarsString = false;
	}
}

video = searchVideo(flashvarsString);
video;