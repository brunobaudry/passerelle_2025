/**
 * We will build this game step by step together.
 * You will make some changes to make it your own.
 * 
 * @todo :
 * - Load current api languages.
 *      1. Fetch the language list from the API <<<<<<
 *      2. Loop through it.
 *      3. Create input buttons in the loop
 *      3. add the inputs in div id="languages" ()
 * - Add levels and auto increase word count and length.
 * - Add penalty when user skips word.
 * - Add username associated with the records.
 * - Improve display.
 */
this.onload = async ()=>{
    /*********************************************
     * VARIABLES
     ********************************************/
    let randomWords=''; // The words sentence the user needs to type.
    let startTime=0; // Time the user takes to type the word (updated every millisecond).
    let timerRecorded=0; // timer record (updated every cents of second).
    let intervalID=0;// an ID for the Timer so that we can stop it.
    let allRecords = []; // Array of timer recorded.
    let lastWasDead = false; // Trick for ô style double strokes
    /*********************************************
     * CONSTANTS
     ********************************************/
    const apiUrl = "https://random-word-api.herokuapp.com";
    /**
     * get the HTML elements
     */
    const randomWordP = document.querySelector('#randomword');// get the html element for randWord
    const timerP = document.querySelector("#timer");// get the timer P element
    const startBtn = document.querySelector('#startgame');// start button
    const allRecordsOL = document.querySelector('#allRecords'); // list of records
    const nbWordInput = document.querySelector("#nb");
    const languagesContainer = document.querySelector("#languages");
    const lengthInput = document.querySelector("#len");//==> EXPLAIN THIS LINE OF CODE
    const typeWordP = document.querySelector('#typedword');// get the html element for user typed
    let langs = [];
   
    const initialize = (data)=>{ // Only when we got the languages can we start the Game.
        langs = data;
        // console.log(langs);
       createLanguageButtons(langs); // Add the radios to the page
       typeWordP.addEventListener('input',onInput);
       startBtn.addEventListener('click',startGame); // listen to click on start button
       // Add an event listener to listen to keyboard type.
        document.addEventListener('keydown', onKey);
    }
    /**
     * 
     * @param {Event} event 
     */
    const onKey = (event) => {
        const keyTyped = event.key;
        if (keyTyped === "Dead") {
            // Trick for ô style double strokes.
            lastWasDead = true;
        } else {
            lastWasDead = false;
            if(keyTyped === "Enter"){
                startGame();
            } else if (timerRecorded > 0 && (event.key === 'Backspace' || event.key === 'Delete')) {
                // Delete or backspace.
                console.log('keydown');
                onInput(null);
            }
        }
    };
    /**
     * Add the radios to the page.
     * @param {array} langs 
     */
    const createLanguageButtons = (langs)=>{
        addRadioElements('en', true);
        for(let i = 0; i < langs.length; i++){
            addRadioElements(langs[i], false);
        }
    }
    /**
     * 
     * @param {String} lang 
     * @param {Boolean} first 
     */
    const addRadioElements = (lang, first)=>{
        const label = document.createElement('label');
        label.setAttribute('for',lang);
        label.textContent = lang;
        // Create the input.<input type="radio" value="de" id="de" name="lang" checked/><br/>
        const input = document.createElement('input');
        input.type = 'radio'; // input.setAttribute('type','radio'); // The type of input.
        input.setAttribute('value',lang); // What will be set as value
        input.setAttribute('id',lang);
        input.setAttribute('name',"lang"); // Same as same radio buttons
        input.checked = first;
        // Add the items to the radio container
        languagesContainer.appendChild(label);
        languagesContainer.appendChild(input);
        languagesContainer.appendChild(document.createElement('br'));
    }
    /**
     * 
     */
    async function startGame(){
        clearInterval(intervalID); // Reset the interval loop
        // Get language
        const langInput = document.querySelector("[name='lang']:checked");
        // Fetch the random from the API.
        randomWords = await getRandomWord(lengthInput.value, nbWordInput.value, langInput.value);
        randomWordP.textContent = randomWords; // put the random word in the P element
        // Resetting 
        typeWordP.innerHTML = typeWordP.value = "";
        timerRecorded = startTime = 0; // Init times.
        // Start the timer.
        intervalID = setInterval(updateTimer,10);
        // Stop blinking
        timerP.classList.remove('blink');
        randomWordP.classList.remove('blink');
        // Putting the ouse caret in the text box.
        // Oppposite is call blur.
        typeWordP.focus();
    }
    /**
     * => Explain
     * @param {Number} lngth 
     * @param {Number} nmber 
     * @param {String} lng 
     * @returns {String}
     */
    async function getRandomWord(lngth, nmber, lng){
        console.log(lng);
        // String interpolated url with parameters as variables
        const url = `${apiUrl}/word?length=${lngth}&number=${nmber}&lang=${lng}`;
        // Call http.
        const response = await fetch(url);
        // Get the rsponse data.
        const data = await response.json();
        // Return the data to the function call.
        return data.join(" ");
    }
    /**
     * 
     * @returns 
     */
    async function getLanguages() {
        const url = `${apiUrl}/languages`;
        const response = await fetch(url);
        // get the response data
        const data = await response.json();
        // return the data to the function call
        return data;
    }
    /**
     * ==> EXPLAIN what the function startGame() does
     * @return void
     */
    const updateTimer = ()=>{
        timerRecorded = (startTime++/100).toFixed(2); // start time with 2 digit format 1.000001 = 1.00
        timerP.textContent = "time: " +  timerRecorded +" s";
    }
    /**
     * ==> EXPLAIN what the function startGame() does
     * @param {Event} event
     */
    const onInput = (event)=>{
        let typedString = typeWordP.textContent;
        if(event==null){
            typedString = typedString.slice(-1);
        }
        checkWord(typedString);
        if(!lastWasDead){
            randomWordP.innerHTML = wordHighlighter(typedString);
        }
    }
    /**
     * ==> EXPLAIN
     * @param text
     * @returns {String}
     */
    const wordHighlighter = (text)=>{
        let displayText = '';
        let end = randomWords.substring(text.length);
        // console.log(text, end);
        for (let i = 0; i < text.length; i++) {
            // Loop through all char of typed and compare to the current word
            // and replace spaces by non breaking spaces...
            const charA = text[i].replace(/ /g, '\u00A0').charCodeAt(0);
            const charB = randomWords[i].replace(/ /g, '\u00A0').charCodeAt(0);
            console.log(text[i], text[i] == ' ', charA, randomWords[i]== ' ', charB);
            if (charA == charB) {
                displayText += `<span class="correct">${randomWords[i]}</span>`;
            } else {
                displayText += `<span class="wrong">${randomWords[i]}</span>`;
            }
        }
        return displayText + end;
    }
    /**
     * ==> EXPLAIN
     * @param {String} typed
     */
    const checkWord = (typed)=>{
        //==> EXPLAIN THIS if BLOCK OF CODE (these 4 lines below)
        if(typed === randomWords){
            clearInterval(intervalID);
            typeWordP.blur();
            timerP.setAttribute("class","blink");
            randomWordP.classList.add("blink");
            allRecords.push( {time: timerRecorded, word:typed });
            allRecords.sort((a, b) => a.time - b.time);
            allRecordsOL.innerHTML = "";
            allRecords.forEach(element => {
                const li = document.createElement("li");
                li.textContent = `${element.time}s (${element.word})`;
                allRecordsOL.appendChild(li);
            });
            timerRecorded = startTime = 0;
        }
    }
    // Initialize the game.
    getLanguages().then(initialize);
}
