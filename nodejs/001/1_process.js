/************************************
 * Process
 ***********************************/
const process = require('process');
// console.log(process.cwd()); // Current working directory.
// process.chdir('..');
// console.log(process.cwd()); // Current working directory.
// process.chdir('002');
// console.log(process.cwd()); // Current working directory.
// console.log(process.env);
// console.log(process.env.HOME);
// console.log(process.config);
// console.log(process.version);
// console.log(process.platform);
console.log(process.argv); // List command arguments. 0 is node app path and 1 is current script
console.log('My funky script says ' +process.argv[2]+' ' + process.argv[3]);
// console.log(process.arch); // Architecture.