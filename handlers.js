/**
 *  User defined handlers
 *
 *  A list of objects containing the 'pattern' and the 'action' for
 *  each 'pattern'.
 *
 *  Example:
 *
 *  //export the list of handlers
 *  exports.handlers = [
 *      //The handler object
 *      {
 *          //The pattern is a string
 *          pattern : 'foo',
 *
 *          //The action must be a function that receive a response
 *          action : function(response) {
 *              response.end("The page is no longer available!");
 *          }
 *      },
 *
 *      //... a lot of handlers can be defined
 *  ];
 *
 *
 * */

/**
 *  Example handlers
 **/
exports.handlers = [
{
    pattern : 'facebook',

    action : function(response) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end("<h1>Ups, Sorry. <br/><br/> I Like Facebook but I Block it... <br/><br/> Please Contact the Administrator </h1>");
    }
},
{
    pattern : 'google',

    action : function(response) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write("<h1>Hello Google!</h1><br/>");
        response.end();
    }
},
];
