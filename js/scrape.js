chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
   if (msg.action == 'savePhoto') {
      saveInstaAssetToServer(msg.info, msg.tab, msg.serverUrl);
   }
});

function MediaAsset () {
	this.code = null;
	this.instagramAssetJson = {};
	this.image_url = '';
	this.video_url = '';
	this.instagram_url = '';

	this.travel_day_nbr = null;

	this.type = '';
	this.caption = '';
	this.likes = '';

	this.created_date_epoch = '';
	this.created_date

	this.location_id = null;
	this.location_name = '';
	this.latitude = null;
	this.longitude = null;

	this.saveToDatabase = function (serverUrl) {

		var post_params = { 
			"code": this.code,
			"type": this.type,

			"image_url": this.image_url,
			"video_url": this.video_url,
			"instagram_url": this.instagram_url,

			"travel_day_nbr": this.travel_day_nbr,

			"caption": this.caption,
			"likes": this.likes,
			"travel_day_nbr": this.travel_day_nbr,

			"location_id": this.location_id,
			"location_name": this.location_name,
			"latitude": this.latitude,
			"longitude": this.longitude,

			"created_date_epoch": this.created_date_epoch,


	    };
		console.log("- Post Parameters: ");
		console.log(post_params);

		chrome.runtime.sendMessage({
		    method: 'POST',
		    action: 'xhttp',
		    url: serverUrl + "/api/add",
		    data: jQuery.param(post_params),
		    contentType: 'application/json',
	        dataType : 'json'
		}, function(responseText) {
		    alert(responseText);
		    //var overlay = jQuery('<div id="itlystoverlay" style="position:absolute; top:10px; right: 10px; background-color: #fff; font-weight: bold; ">hellomynameisjoe</div>');
			//overlay.appendTo(document.body)
		});
	}

	this.init = function () {
		var self = this;
		$("script").each(function(i) {
			//console.log($(this).html());
			if ($(this).html().substring(0,18) == 'window._sharedData') {
				var jsonString = $(this).html().substring(21);
				jsonString = jsonString.slice(0, -1);
				//console.log(jsonString);
				var json = JSON.parse(jsonString);
				self.instagramAssetJson = json;
				//console.log("instagramAssetJson: ");
				//console.log(this.instagramAssetJson);
				/*
				console.log("caption: " + json['entry_data']['PostPage'][0]['media']['caption'] );
				console.log("id code: " + json['entry_data']['PostPage'][0]['media']['code'] );
				console.log("date_key: " + json['entry_data']['PostPage'][0]['media']['date'] );
				console.log("likes: " + json['entry_data']['PostPage'][0]['media']['likes']['count'] );
				console.log("loc id: " + json['entry_data']['PostPage'][0]['media']['location']['id'] );
				console.log("loc name: " + json['entry_data']['PostPage'][0]['media']['location']['name'] );
				console.log("is ad: " + json['entry_data']['PostPage'][0]['media']['is_ad'] );
				console.log("is vid: " + json['entry_data']['PostPage'][0]['media']['is_video'] );
				console.log("display src: " + json['entry_data']['PostPage'][0]['media']['display_src'] );
				*/
			}
		});
		//console.log("instagramAssetJson: ");

	}
	
	this.setType = function () {
		if (this.instagramAssetJson['entry_data']['PostPage'][0]['media']['is_video'] == true) {
			this.type = 'video';
		}
		else {
			this.type = 'image';
		}
	}


	this.setTravelDay = function () {
		this.travel_day_nbr = this.caption.substring(0,15).match("ay(.*):")[1].trim();
		//this.travel_day_nbr = 8;

	}

	this.setCode = function () {
		this.code = this.instagramAssetJson['entry_data']['PostPage'][0]['media']['code'];
	}
	this.setImageUrl = function () {
		try {
		    this.image_url = this.instagramAssetJson['entry_data']['PostPage'][0]['media']['display_src'];
		    this.image_url = this.image_url.substring(0, this.image_url.indexOf('.jpg') + 4);
		}
		catch(err) {
		    this.image_url = '';
		}	
	}
	this.setVideoUrl = function () {
		try {
		    this.video_url = this.instagramAssetJson['entry_data']['PostPage'][0]['media']['video_url'];
		}
		catch(err) {
		    this.video_url = '';
		}		
	}
	this.setInstagramUrl = function (info) {
		this.instagram_url = info.pageUrl;
	}
	this.setCaption = function () {
		this.caption = this.instagramAssetJson['entry_data']['PostPage'][0]['media']['caption'];
	}	
	this.setLikes = function () {
		this.likes = this.instagramAssetJson['entry_data']['PostPage'][0]['media']['likes']['count'];
	}		
	this.setCreatedDateEpoch = function () {
		this.created_date_epoch = this.instagramAssetJson['entry_data']['PostPage'][0]['media']['date'];
	}	

	this.setLocationId = function () {
		try {
			this.location_id =  this.instagramAssetJson['entry_data']['PostPage'][0]['media']['location']['id'] ;
		} catch(err) {
		    this.location_id = '';
		}
	}	
	this.setLocationName = function () {
		try {
			this.location_name =  this.instagramAssetJson['entry_data']['PostPage'][0]['media']['location']['name'];
		} catch(err) {
		    this.location_name = '';
		}
	}
	this.setLatitude = function () {
		this.latitude = '';
	}	
	this.setLongitude = function () {
		this.longitude = '';
	}

	this.saveImageLocally = function () {
		
	}

	this.saveImageJsontoFolder = function () {
		
	}
}


//Send the selected note and related page attributes to the note and other related tables
var saveInstaAssetToServer = function (info, tab, serverUrl)  {
	console.log("-----------------------------------------------");
	//console.log("info: " + JSON.stringify(info));
    //console.log("tab: " + JSON.stringify(tab));
    //console.log("server: " + serverUrl);

	m = new MediaAsset();
	m.init();

	m.setCode();
	m.setType();

	m.setImageUrl();
	m.setVideoUrl();

	m.setInstagramUrl(info);


	m.setCaption();
	m.setLikes();
	m.setTravelDay();

	m.setCreatedDateEpoch();

	m.setLocationId();
	m.setLocationName();


	//Call an API to get the lat long
	// m.setLatitude()
	// m.setLongitude();

	//m.saveImageLocally(LOCAL_FOLDER);
	//m.saveImageJsontoFolder(LOCAL_FOLDER );

	console.log("Media Asset: ");
	console.log(m);

	m.saveToDatabase(serverUrl);

	/*
	chrome.downloads.download({
	  url: m.image_url,
	  filename: "/Users/mars/Downloads/img" // Optional
	});
	*/

	//downloadResource (info, tab, m.image_url);

	//var a = document.createElement('a');
	//a.href = m.image_url;
	//a.download = 'iana-logo-pageheader.png'; // Filename
	//a.click();                               // Trigger download

	//var myString = "Lorem ipsum.";
    //window.open('data:text/csv;charset=utf-8,' + escape(myString));

}