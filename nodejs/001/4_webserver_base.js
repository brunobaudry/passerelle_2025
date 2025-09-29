const http = require('http');
const myHost = 'localhost';
const myPort = 3000;
const server = http.createServer((req,rep)=>{
    /************************* 
     * basic request headers 
     ************************/// console.log(req);
    console.log(myHost+':'+myPort +req.url);
    // console.log(req.rawHeaders);
    console.log(req.method);
    console.log(req.headers.cookie);
    rep.write('hello'); // Create the response.
    rep.end(); // Send it (to the browser).
    // console.log(req.headers);
    // console.log(req.headers.accept);
});
/****************
 * START SERVER
 ***************/ 
server.listen(myPort,myHost);