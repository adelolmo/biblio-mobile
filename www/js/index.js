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
var scannedBookResource;

var app = {

    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function () {
          // listeners for page books
        $("#buttonScan").click(function () {
            app.scanBook();
        });
        $("#buttonAdd").click(function () {
            $('#newTitle').val('');
            $('#newAuthor').val('');
            $('#newTags').val('');
        });

        // listeners for page scannedBook
        $("#buttonCancelScannedBook").click(function () {
            $('tr:last').remove();
            restclient.deleteRequest(scannedBookResource,
                function () {
                    // ignore success
                },
                {relativeResource: false});
        });
        $("#buttonSaveDetailBook").click(function () {
            app.editBook($('#detailId').val(), $('#detailTitle').val(),
                $('#detailAuthor').val(), $('#detailTags').val());
            $.mobile.changePage('#pageBooks');
        });
        $("#buttonDeleteDetailBook").click(function () {
            app.deleteBook($('#detailId').val());
            $.mobile.changePage('#pageBooks');
        });

        // listeners for page newBook
        $("#buttonSaveNewBook").click(function () {
            app.createBook($('#newTitle').val(),
                $('#newAuthor').val(), $('#newTags').val());
            $.mobile.changePage('#pageBooks');
        });

        restclient.getRequest("/books", function (data) {
            $table = $('tbody');
            $.each(data, function (i, item) {
                app.addJsonBookToTable($table, item);
            })
        });
        $("#table-custom-2").find("tbody").delegate("tr", "click", function () {
            app.navigateBookDetail($(this).attr("id"));
        });

    },

    navigateBookDetail: function (bookId) {
        app.getBook(bookId,
            function (data) {
                $.mobile.changePage('#pageDetailBook');
                $('#detailId').val(data.id);
                $('#detailTitle').val(data.title);
                $('#detailAuthor').val(data.author);
                $('#detailTags').val(data.tags);
                $('#detailImage').attr('src', data.imageUrl);
            })
    },

    scanBook: function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (!result.cancelled) {
                    app.sendBarCode(result.text, result.format,
                        function (data) {
                            screen.lockOrientation('portrait');

                            $.mobile.changePage('#pageScannedBook');
                            $('#scannedTitle').html('Title: ' + data.title);
                            $('#scannedAuthor').html('Author: ' + data.author);
                            $('#scannedImage').attr('src', data.imageUrl);

                            app.addJsonBookToTable($('tbody'), data);
                            screen.unlockOrientation();
                        });
                }
            },

            function (error) {
                alert("Scanning failed: " + error);
            }
        );
    },

    createBook: function (title, author, tags) {
        restclient.postRequest("/books",
            {title: title, author: author, tags: tags},
            function (location, data) {
                restclient.getRequest(location, function (data) {
                        app.addJsonBookToTable($('tbody'), data)
                    },
                    function (error) {
                        alert(error);
                    },
                    {relativeResource: false});
            },
            function (error) {
                alert(error);
            })
    },

    editBook: function (id, title, author, tags) {
        $('#' + id + 'title').html(title);
        $('#' + id + 'author').html(author);
        $('#' + id + 'tags').html(author);

        restclient.putRequest("/books/" + id,
            {title: title, author: author, tags: tags},
            function (data) {
                // TODO toast for modification success
            });
    },

    deleteBook: function (id) {
        restclient.deleteRequest("/books/" + id,
            function () {
                // TODO toast for modification success
                $('#' + id).remove();
            });
    },

    getBook: function (bookId, onSuccessCallback) {
        restclient.getRequest("/books/" + bookId,
            function (data) {
                if (onSuccessCallback) {
                    onSuccessCallback(data);
                }
            })
    },

    sendBarCode: function (isbn, format, onSuccessCallback) {
        restclient.postRequest("/barcode",
            {isbn: isbn, format: format},
            function (location, data) {
                scannedBookResource = location;
                onSuccessCallback(data);
            },
            function (data) {
                alert(data.error);
            });
    },

    addJsonBookToTable: function (element, jsonBook) {
        var date = new Date();
        date.setTime(jsonBook.ctime);

        //app.addBookToTable(element, jsonBook.id, jsonBook.title, jsonBook.author, jsonBook.date);
        element.append('<tr id="' + jsonBook.id + '">' +
            '<td id="' + jsonBook.id + 'title">' + jsonBook.title + '</td>' +
            '<td id="' + jsonBook.id + 'author">' + jsonBook.author + '</td>' +
            '<td id="' + jsonBook.id + 'date">' + dates.parseUnixDate(date) + '</td>' +
            '</tr>');
    },

    addBookToTable: function (element, bookId, title, author, date) {
        element.append('<tr id="' + bookId + '">' +
            '<td id="' + bookId + 'title">' + title + '</td>' +
            '<td id="' + bookId + 'author">' + author + '</td>' +
            '<td id="' + bookId + 'date">' + dates.parseUnixDate(date) + '</td>' +
            '</tr>');
    }
};

app.initialize();