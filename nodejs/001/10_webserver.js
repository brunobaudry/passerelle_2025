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
    console.log(myURL);
    if(myURL.pathname === '/'){
        // Root request.
        myHTML = fs.readFileSync('static/index.html');
    }else if (fs.existsSync(`static/${myURL.pathname}.html`)){
        myHTML = fs.readFileSync(`static/${myURL.pathname}.html`);
    }else if(fs.existsSync(`templates/${myURL.pathname}.html`)){
        let TITLE = myURL.pathname.replace('/','').toUpperCase();
        myHTML = fs.readFileSync(`templates/${myURL.pathname}.html`).toString();
        myHTML = myHTML.replaceAll('<%TITLE%>', TITLE );
    }else if(fs.existsSync('.'+myURL.pathname)){
        console.log(myURL.pathname, 'exists');
       myHTML = fs.readFileSync('.'+myURL.pathname);
    }
    else{
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


/* 
 if(requestIsDir){
        if(myURL.pathname === '/'){
                // Root request.
                const myIndex = fs.readFileSync('templates/index.html');
            
                let finaltemplate = myIndex.toString().replaceAll('<%TITLE%>', myData.title);
                rep.setHeader('Content-Type','text*html');
                rep.write(myIndex);
                return rep.end();
            }
    }else{

    }
    if(req.url === '/'){
        // Root request.
        const myIndex = fs.readFileSync('templates/index.html');
       
        let finaltemplate = myIndex.toString().replaceAll('<%TITLE%>', myData.title);
        rep.setHeader('Content-Type','text*html');
        rep.write(finaltemplate);
        return rep.end();
    }else{
        if(fs.existsSync('.'+req.url) && fs.lstatSync('.'+req.url).isDirectory() && req.url !== '/') {
            rep.statusCode = 404;
        }else{
            if(req.url.indexOf(".css")>-1){
                rep.setHeader('Content-Type','text*css');
                try{
                    //console.warn('.'+req.url);
                    rep.write(fs.readFileSync('.'+req.url));
                }
                catch(e){
                    console.warn(e);
                }
            }else if(req.url.indexOf('/profile') != -1){
                console.log("profile");
                const body = [];
                req.on('data', (chunk)=>{
                    console.log(chunk);
                    body.push(chunk);

                });
                req.on('end', ()=>{
                    // Buffer.concat(body).forEach((v,i)=>{console.log(i,v);});
                    console.log(Buffer.concat(body).toJSON());    
                });
                const myProfile = fs.readFileSync('templates/profile.html');
                let finaltemplate = myProfile.replaceAll('<%TITLE%>', myData.title);
                finaltemplate = finaltemplate.toString().replaceAll('<%NAME%>', myData.title);
                rep.setHeader('Content-Type','text*html');
                rep.write(finaltemplate);
                return rep.end();
            }
            
        }
        return rep.end();
    }
    
    //rep.write('Hello');
    //rep.write('</h1>'); */