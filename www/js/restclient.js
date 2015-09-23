var serverUrl = "http://192.168.178.29:8080";

var restclient = {
    postRequest: function (resource, payload, onSuccessCallback, onErrorCallback) {
        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: serverUrl + resource,
            data: JSON.stringify(payload),
            error: function (xhr, status, error) {
                //alert("error: " + error.message + " status: " + status + "\nxhr: " + xhr);
                if (onErrorCallback) {
                    //var json = JSON.stringify(xhr.responseText);
                    alert(xhr.responseText);
                    onErrorCallback(xhr.responseText)
                }
            },
            success: function (data, status, xhr) {
                if (onSuccessCallback) {
                    onSuccessCallback(xhr.getResponseHeader('Location'), data);
                }
            }
        });
    },

    putRequest: function (resource, payload, onSuccessCallback, onErrorCallback) {
        $.ajax({
            type: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: serverUrl + resource,
            data: JSON.stringify(payload),
            error: function (xhr, status, error) {
                //alert("error: " + error.message + " status: " + status + "\nxhr: " + xhr);
                if (onErrorCallback) {
                    //var json = JSON.stringify(xhr.responseText);
                    alert(xhr.responseText);
                    onErrorCallback(xhr.responseText)
                }
            },
            success: function (data, status, xhr) {
                if (onSuccessCallback) {
                    onSuccessCallback(xhr.getResponseHeader('Location'), data);
                }
            }
        });
    },

    getRequest: function (resource, onSuccessCallback, onErrorCallback) {
        $.ajax({
            type: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: serverUrl + resource,
            error: function (xhr, status, error) {
                //alert("error: " + error.message + " status: " + status + "\nxhr: " + xhr);
                if (onErrorCallback) {
                    var json = $.parseJSON(xhr.responseText);
                    onErrorCallback(json.error)
                }
            },
            success: function (data, status, xhr) {
                if (onSuccessCallback) {
                    //var json = JSON.stringify(data);
                    onSuccessCallback(data);
                }
            }
        });
    },

    deleteRequest: function (resource, isFullUrlResource) {
        var resourceUrl;
        if (isFullUrlResource) {
            resourceUrl = resource;
        } else {
            resourceUrl = serverUrl + resource;
        }

        $.ajax({
            type: "DELETE",
            url: resourceUrl
        });
    }
};