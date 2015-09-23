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
var scannedBookResource;

var app = {

    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function () {
        //app.receivedEvent('deviceready');
        $("#scan").click(function () {
            app.scanBook();
        });
        $("#add").click(function () {
            window.location.href = '#scannedBook';
        });
        $("#cancelScannedBook").click(function () {
            $('tr:last').remove();
            window.location.href = '#books';
            app.deleteRequest(scannedBookResource);
        });
        $("#addScannedBook").click(function () {
            window.location.href = '#books';
        });
        $("#returnDetailBook").click(function () {
            window.location.href = '#books';
        });
        $("#saveDetailBook").click(function () {
            app.editBook($('#detailId').val(), $('#detailTitle').val(), $('#detailAuthor').val());
            window.location.href = '#books';
        });

        app.getRequest("/books", function (data) {
            $table = $('tbody');
            $.each(data, function (i, item) {
                app.addBookToTable($table, item);
            })
        });
        $("#table-custom-2").find("tbody").delegate("tr", "click", function () {
            app.navigateBookDetail($(this).attr("id"));
        });

    },

    navigateBookDetail: function (bookId) {
        app.getBook(bookId,
            function (data) {
                window.location.href = '#detailBook';
                $('#detailId').val(data.id);
                $('#detailTitle').val(data.title);
                $('#detailAuthor').val(data.author);
                $('#detailImage').attr('src', data.imageUrl);
            })
    },

    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    scanBook: function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    app.sendBarCode(result.text, result.format,
                        function (data) {
                            screen.lockOrientation('portrait');

                            window.location.href = '#scannedBook';
                            $('#scannedTitle').html('Title: ' + data.title);
                            $('#scannedAuthor').html('Author: ' + data.author);
                            $('#scannedImage').attr('src', data.imageUrl);

                            app.addBookToTable($('tbody'), data);
                            screen.unlockOrientation();
                        });
                }
            },

            function (error) {
                alert("Scanning failed: " + error);
            }
        );
    },

    editBook: function (id, title, author) {
        $('#' + id + 'title').html(title);
        $('#' + id + 'author').html(author);

        app.putRequest("/books/" + id,
            {title: title, author: author},
            function (data) {
                // TODO toast for modification success
            });
    },

    getBook: function (bookId, onSuccessCallback) {
        app.getRequest("/books/" + bookId,
            function (data) {
                if (onSuccessCallback) {
                    onSuccessCallback(data);
                }
            })
    },

    sendBarCode: function (isbn, format, onSuccessCallback) {
        console.log('sendBarCode isbn[' + isbn + '] format[' + format + ']');

        app.postRequest("/barcode",
            {isbn: isbn, format: format},
            function (location, data) {
                //alert("location: " + location + "  data: " + data);
                scannedBookResource = location;

                onSuccessCallback(data);
            },
            function (data) {
                alert(data.error);
            });
    },

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

    deleteRequest: function (resource) {
        $.ajax({
            type: "DELETE",
            url: resource
        });
    },

    addBookToTable: function (element, jsonBook) {
        var date = new Date();
        date.setTime(jsonBook.ctime);

        element.append('<tr id="' + jsonBook.id + '">' +
            '<td id="' + jsonBook.id + 'title">' + jsonBook.title + '</td>' +
            '<td id="' + jsonBook.id + 'author">' + jsonBook.author + '</td>' +
            '<td id="' + jsonBook.id + 'date">' + app.parseUnixDate(date) + '</td>' +
            '</tr>');
    },

    parseUnixDate: function (date) {

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = date.getFullYear();
        var month = months[date.getMonth()];
        var day = date.getDate();
        var formattedDay = day + ' ' + month + ' ' + year;

        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();

        var formattedTime = hours + ':' + minutes.substr(-2);
        return formattedDay + ' ' + formattedTime;
    }
};

app.initialize();