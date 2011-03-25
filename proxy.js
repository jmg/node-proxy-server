/**
 ***********************************************************************
 *
 *    This program is free software; you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation; either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program; if not, write to the Free Software
 *    Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 *    MA 02110-1301, USA.
 *
 ***********************************************************************
 *
 *
 *    Proxy Server with customizable Requests Handlers V1.0
 *
 *    This server run over Node js v0.4.1
 *    Last Version on: http://nodejs.org/
 *
 *    To run the server just type in the console:
 *
 *    ~$ node proxy.js
 *
 *
 *     Author: Juan Manuel García <jmg.utn@gmail.com>
 *
 */

var sys = require("sys");
var http = require("http");
/**
 *  User defined module containing the special handlers
 **/
var special_handler = require("./handlers");

/**
 *  ignore common connection errors like broken pipes.
 **/
process.on('uncaughtException', function (err) {});

/**
 *  Default handler. Proxy the requests that don't match the patterns
 **/
var proxy_handler = function(response, data) {
    response.write(data, 'binary');
}

/**
 *  This is the Request Handler function for the server.
 **/
var requestHandler = function(clientRequest, clientResponse) {

    sys.puts("Request: " + clientRequest.url);

    /* Create the client */
    var proxy = http.createClient(80, clientRequest.headers['host'])
    /* Do the request */
    var client = proxy.request(clientRequest.method, clientRequest.url, clientRequest.headers);

    /* Hanlde on response event */
    client.on("response", function(response) {

        sys.puts("Status Code: " + response.statusCode);

        clientResponse.writeHeader(response.statusCode, response.headers);

        /* By Default the handler is proxy_handler */
        handler = proxy_handler;

        /**
         * Process the user defined patterns and handlers
         * */
        for (hand in special_handler.handlers) {

            if (clientRequest.url.search(special_handler.handlers[hand].pattern) != -1)
            {
                handler = special_handler.handlers[hand].action
                break;
            }
        }

        /* Write the response data while receive */
        response.on('data', function(data) {
            handler(clientResponse, data);
        });

        /* Close the connection */
        response.on("end", function() {
            clientResponse.end();
        })
    });

    /* Write the request data while receive */
    clientRequest.on("data", function (chunk) {
        client.write(chunk, 'binary');
    });

    /* Close the connection */
    clientRequest.on("end", function () {
        client.end();
    });
}

/**
 *  Create and run the server!
 **/
var server = http.createServer(requestHandler);
server.listen(8000);
sys.puts("Server running at http://127.0.0.1:8000/")
