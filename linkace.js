window.onload = function() {
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

    checked = true;

    sitesToExclude.forEach(function(site) {
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

        fetch("https://www.your-linkace-host.com", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Content-Type: "application/json;charset=utf-8",
                    Authorization: "Bearer YOUR_KEY"
                },
                body: JSON.stringify(_payload)
            })
            .then((response) => {
                if (response.ok) {
                    // Request was successful
                    return response.json();
                } else if (response.status === 422) {
                    // Error occurred with status code 422
                    return response.json().then((errorResponse) => {
                        var errorMessage = errorResponse.message;
                        console.log(errorMessage);
                        throw new Error(errorMessage);
                    });
                } else {
                    // Handle other status codes
                    var errorMessage = errorResponse.message;
                    console.log(errorMessage);
                    throw new Error(
                        "Request failed with status: " + response.status
                    );
                }
            })
            .then((data) => {
                // Process the response
                console.log(data);
            })
            .catch((error) => {
                // Handle any errors
                console.error(error);
            });
    }
};