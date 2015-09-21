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
            app.sendBook('11', 'theF');
        });

        $.getJSON("http://bibliorest-adoorg.rhcloud.com/books",
            function (data) {

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
                    app.sendBook(result.text, result.format);
                }
            },

            function (error) {
                alert("Scanning failed: " + error);
            }
        );
    },

    sendBook: function (isbn, format) {
        console.log('sendBook isbn[' + isbn + '] format[' + format + ']');

        app.postRequest("http://bibliorest-adoorg.rhcloud.com/books/" + isbn,
            {format: format, code: "mockCode"});
    },

    postRequest: function(resource, payload){
        $.ajax({
            type: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            url: resource,
            //url: "http://192.168.178.29:8080/books/" + isbn,
            data: JSON.stringify(payload),
            error: function (xhr, status, error) {
                alert("error: " + error.message + " status: " + status + "\nxhr: " + xhr);
            }
        });
    }
};

app.initialize();