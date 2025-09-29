// const url = require('node:url'); //
const http = require('http');   
const myHost = 'localhost';
const myPort = 3000;
/***********************************
 * Open and Read a database
 ***********************************/
const fs = require('node:fs');
const server =  http.createServer((req,rep)=>{
    /*********************************
     *  URL helper 
     * ******************************/
    let myURL = new URL(`http://${myHost}:${myPort}${req.url}`);
    rep.setHeader('Content-Type','text*html');
    let myHTML = '';
    if(myURL.pathname === '/'){
        // Root request.
        myHTML = fs.readFileSync('static/index.html');
    }else if (fs.existsSync(`static/${myURL.pathname}.html`)){
        myHTML = fs.readFileSync(`static/${myURL.pathname}.html`);
    }else{
        myHTML = fs.readFileSync(`static/404.html`);
    }
    rep.write(myHTML);
    return rep.end();
});
/****************
 * START SERVER
 ***************/ 
server.listen(myPort,myHost);