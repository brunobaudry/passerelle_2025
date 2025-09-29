// const url = require('node:url'); //
const http = require('http');
const myHost = 'localhost';
const myPort = 3000;
const server =  http.createServer((req,rep)=>{
    /*********************************
     *  URL helper 
     * ******************************/
    let myURL = new URL(`http://${myHost}:${myPort}${req.url}`);
    // rep.write('<html>');
    rep.write(myURL.pathname);
    rep.write('\n');
    rep.write(myURL.host);
    rep.write('\n');
    rep.write(myURL.search);
    rep.write('\n');
    rep.write(myURL.hash);
    rep.write('\n');
    myURL.searchParams.forEach((v,k)=>{
        rep.write(k + " : " +v);
    });
    rep.end();
});
/****************
 * START SERVER
 ***************/ 
server.listen(myPort,myHost);