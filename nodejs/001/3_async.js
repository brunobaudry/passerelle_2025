console.log('Start');

setTimeout(()=>{console.log('Time out after 2s')},2000);


/**
 * 
 * @returns {Promise}
 */
const fetchData = () =>{
    // Create a Promise object.
    const promise = new Promise((success, reject) => {
        setTimeout(()=>{
            success(`fetchData says success !`);
        }, 1000);
    });
    return promise;
}
// Calling the Async Promise.
fetchData().then((myText)=>{
    console.log(myText);
});

/* setTimeout(()=>{
    console.log('Time started after 1.5s');
    fetchData()
    .then(text=>{
        console.log(text);
        return fetchData();
    }
    )
    .then(
        text2=>{
            console.log(text2 + ' twice');
        }
    );
},1500); */


// https://random-word-api.herokuapp.com/word



fetch('https://random-word-api.herokuapp.com/word')
  .then(response => response.json()) // returns a Promise that resolves to a Response object.
  .then(jsonData => console.log(jsonData)) //  returns a Promise — it asynchronously parses the response body as JSON
  .catch(error => console.error('Error:', error));


/* 
fetch('https://no-such-server.blabla') // rejects
  .then(response => response.json())
  .catch(err => console.warn(err))  */

console.log('Last line');

