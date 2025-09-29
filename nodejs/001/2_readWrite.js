/*********************************
 * 001 Read and write to file.
**********************************/ 
// const { error } = require('console');
const fs = require('fs'); // Requires the file system library (A Node default library).
// Basic text
const HELLO = 'Hello from node Bro';
// console.log(HELLO);
/** **************
 * Write to file.
 ****************/
fs.writeFileSync('hello.txt',HELLO);
/**
 * Read file
 * If you don't pass an encoding type as part of the options for fs.readFile(), 
 * then it gives you a Buffer object, not a string as the data.
 */
const hello = fs.readFileSync('hello.txt', 'utf-8');
// console.log(hello);
//const readfile = fs.readFile('000_app.js');
//const readfile = fs.readFileSync('000_app.js');
// Non buffered
// const readfile = fs.readFile('000_app.js','utf-8');
// const readfile = fs.readFileSync('0_app.js','utf-8');
// console.log(readfile);

//
// const readfile2 = fs.readFile('hello.txt','utf-8');
// console.log(readfile2);

/**
 * Append string to text file.
 */
fs.appendFileSync('hello.txt', ', on more time', (error)=>{
    if(error) console.log(`Error >> ${error}`);
});
fs.appendFileSync('hello.txt',' something more');
const readfile2 = fs.readFile('hello.txt','utf-8', 
(err, data) => {
  if (err) throw err;
    console.log('async '+data);
}
);
/*******************************
 * using Stream 
 *******************************/
const stream = fs.createWriteStream('hello2.txt'); // Open the stream
for(let i=0;i<10;++i){
    const date = new Date();
    stream.write(`${i} log at ${date.toISOString()}\n`);
}
stream.end(); // End the stream
stream.close(); // Close the stream

/*******************************
 * Generating data.csv
 *******************************/
const stream2 = fs.createWriteStream('myData.csv'); // Open the stream
stream2.write('Letters,Numbers,Timestamp\n')
const s = 'abcdefghijkl';
for(let i=0;i<10;++i){
    const date = new Date();
    stream2.write(`${s[i]},${i},${date.toDateString()}\n`);
}
stream2.end(); // Close the stream
stream2.close(); // Close the stream
/************************************
 * Folder
 ***********************************/
const dir = fs.readdirSync('.');// console.log(dir);
dir.forEach((item,index,array)=>{
    const isDirectory = fs.lstatSync(item).isDirectory();
    if(isDirectory){
        console.log(item,index, 'Folder');
    }else{
        console.log(item,index, 'File');
    }
});
