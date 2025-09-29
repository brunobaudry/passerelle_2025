const http = require('http');   
const myHost = 'localhost';
const myPort = 3000;
/***************************************
 * HTTP Listener
 * @param {Request} req 
 * @param {Response} rep 
 */
function reqListener (req,rep){
    console.log(req.url );
    console.log(req.method);
    console.log(req.headers);
    rep.setHeader('Content-Type','text*html');
    if(req.url === '/'){
        rep.write('home');
    }else{
        rep.write('You requested ' + req.url);
    }
    return rep.end();
}
const server1 = http.createServer(reqListener);
server1.listen(myPort, myHost);