var lastUrl;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	storeBookmark();
});


function storeBookmark() {
	sitesToExclude = [
		"www.google.com/search",
		"www.google.com.br/search",
		"bing.com",
		"duckduckgo",
		"pinboard.in",
		"whatsapp",
		"mail.google",
		"outlook.live",
		"file://",
		"localhost",
		"127.0.0.1",
		"intranet"
	];

	if (lastUrl == location.href){
		return;
	}
	else{
		lastUrl = location.href;
	}

	checked = true;

	sitesToExclude.forEach(function (site) {
		if (checked) checked = location.href.indexOf(site) == -1;
	});

	if (checked) {
		_description = document.title;
		_dt1 =
			new Date().getFullYear().toString() +
			("0" + (new Date().getMonth() + 1)).slice(-2) +
			("0" + new Date().getDate()).slice(-2);
		_dt2 =
			new Date().getFullYear().toString() +
			("0" + (new Date().getMonth() + 1)).slice(-2);
		_tags = _dt1 + "," + _dt2;
		_payload = {
			url: location.href,
			title: _description,
			tags: _tags,
			is_private: true,
			check_disabled: false
		};

		fetch("https:/yoursite/public/api/v1/links", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json;charset=utf-8",
				Authorization: "Bearer YourToken"
			},
			body: JSON.stringify(_payload)
		})
			.then((response) => {
				if (response.ok) {
					// Request was successful
					return response.json();
				} 
        		else if (response.status === 422) {
					// Error occurred with status code 422
					return response.json().then((errorResponse) => {
						var errorMessage = errorResponse.message;
						console.log(errorMessage);
						throw new Error(errorMessage);
					});
				} 
        		else {
					// Handle other status codes
					return response.json().then((errorResponse) => {
						var errorMessage = errorResponse.message;
						console.log(errorMessage);
						throw new Error(errorMessage);
					});
				}
			})
			.then((data) => {
				console.log("RESULT::" + JSON.stringify(data));
			})
			.catch((error) => {
				if (error.message != "The url has already been taken."){
					console.error(error);
				}
			});
	}
};
