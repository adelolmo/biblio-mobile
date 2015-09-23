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
        $("#scan").click(function () {
            app.scanBook();
        });
        $("#add").click(function () {
            $('#detailId').val('');
            $('#detailTitle').val('');
            $('#detailAuthor').val('');
            $('#detailTags').val('');
            $('#detailImage').attr('src', '');
            $('#returnDetailBook').hide();
            $('#lendDetailBook').hide();
            window.location.href = '#detailBook';
        });
        $("#cancelScannedBook").click(function () {
            $('tr:last').remove();
            window.location.href = '#books';
            restclient.deleteRequest(scannedBookResource, {relativeResource: false});
        });
        $("#addScannedBook").click(function () {
            window.location.href = '#books';
        });
        $("#backDetailBook").click(function () {
            window.location.href = '#books';
        });
        $("#saveDetailBook").click(function () {
            var bookId = $('#detailId').val();
            if (bookId) {
                app.editBook(bookId, $('#detailTitle').val(),
                    $('#detailAuthor').val(), $('#detailTags').val());
            } else {
                app.createBook($('#detailTitle').val(),
                    $('#detailAuthor').val(), $('#detailTags').val());
            }
            window.location.href = '#books';
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
                window.location.href = '#detailBook';
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

                            window.location.href = '#scannedBook';
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

    getBook: function (bookId, onSuccessCallback) {
        restclient.getRequest("/books/" + bookId,
            function (data) {
                if (onSuccessCallback) {
                    onSuccessCallback(data);
                }
            })
    },

    sendBarCode: function (isbn, format, onSuccessCallback) {
        console.log('sendBarCode isbn[' + isbn + '] format[' + format + ']');

        restclient.postRequest("/barcode",
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