const http = require('http');   
const myHost = 'localhost';
const myPort = 3000;
/***********************************
 * Open and Read
 **********************************/
const fs = require('node:fs'); // fs FileSystem module.
const server =  http.createServer((req,rep)=>{
    /*********************************
     *  URL helper 
     * ******************************/
    let myURL = new URL(`http://${myHost}:${myPort}${req.url}`);
    rep.setHeader('Content-Type','text*html');
    // Check if path exists.
    const pathExists = fs.existsSync('.'+ myURL.pathname);
    if(!pathExists){
        rep.write('<h1>404</h1>');
        return rep.end();
    }
    if(myURL.pathname === '/'){
        // Root request.
        rep.write('<h1>My Home page</h1>');
    }else {
        const page = myURL.pathname.replace("/",'');
        rep.write(`<h1>My ${page}</h1>`);
    }
    return rep.end();
});
/****************
 * START SERVER
 ***************/ 
server.listen(myPort,myHost);