// const url = require('node:url'); //
const http = require('http');   
const myHost = 'localhost';
const myPort = 3000;

/***********************************
 * Open and Read a database
 ***********************************/
const fs = require('node:fs');
const myData = JSON.parse(fs.readFileSync('js/data.json'));
const server =  http.createServer((req,rep)=>{
    /*********************************
     *  URL helper 
     * ******************************/
    let myURL = new URL(`http://${myHost}:${myPort}${req.url}`);
    rep.setHeader('Content-Type','text*html');
    let myHTML = '';
    
    console.log();
    if(myURL.pathname === '/'){
        // Root request.
        myHTML = fs.readFileSync('static/index.html');
    }else if (fs.existsSync(`static/${myURL.pathname}.html`)){
        myHTML = fs.readFileSync(`static/${myURL.pathname}.html`);
    }else if(fs.existsSync(`templates/comon.html`)){
        let TITLE = myURL.pathname.replace('/','').toUpperCase();
        myHTML = fs.readFileSync(`templates/comon.html`).toString();
        myHTML = myHTML.replaceAll('<%TITLE%>', TITLE );
    }else{
        rep.write('404');
        console.warn(myURL.pathname, 404);
    }
    rep.write(myHTML);
    return rep.end();
});
/****************
 * START SERVER
 ***************/ 
server.listen(myPort,myHost);