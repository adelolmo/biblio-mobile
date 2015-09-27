/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

//var serverUrl = "http://bibliorest-adoorg.rhcloud.com";
var serverUrl = "http://192.168.178.29:8080";

var restclient = {
    postRequest: function (resource, payload, onSuccessCallback, onErrorCallback, options) {
        var url = serverUrl + resource;
        if (options) {
            if (options.relativeResource == false) {
                url = resource;
            }
        }

        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", window.localStorage.getItem('sessionToken'));
            },
            data: JSON.stringify(payload),
            error: function (xhr, status, error) {
                //alert("error: " + error.message + " status: " + status + "\nxhr: " + xhr);
                if (onErrorCallback) {
                    //var json = JSON.stringify(xhr.responseText);
                    //alert(xhr.responseText);
                    onErrorCallback(xhr.responseText, xhr.status)
                }
            },
            success: function (data, status, xhr) {
                if (onSuccessCallback) {
                    onSuccessCallback(xhr.getResponseHeader('Location'), data);
                }
            }
        });
    },

    putRequest: function (resource, payload, onSuccessCallback, onErrorCallback, options) {
        var url = serverUrl + resource;
        if (options) {
            if (options.relativeResource == false) {
                url = resource;
            }
        }

        $.ajax({
            type: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", window.localStorage.getItem('sessionToken'));
            },
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

    getRequest: function (resource, onSuccessCallback, onErrorCallback, options) {
        var url = serverUrl + resource;
        if (options) {
            if (options.relativeResource == false) {
                url = resource;
            }
        }

        $.ajax({
            type: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", window.localStorage.getItem('sessionToken'));
            },
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

    deleteRequest: function (resource, onSuccessCallback, options) {
        var url = serverUrl + resource;
        if (options) {
            if (options.relativeResource == false) {
                url = resource;
            }
        }

        $.ajax({
            type: "DELETE",
            url: url,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", window.localStorage.getItem('sessionToken'));
            },
            success: function (data, status, xhr) {
                if (onSuccessCallback) {
                    onSuccessCallback(data);
                }
            }
        });
    }
};