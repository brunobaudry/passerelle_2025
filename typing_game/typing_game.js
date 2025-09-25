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
   const DEFAULTNAME = 'Anonymous';
   let randomWords=''; // The words sentence the user needs to type.
   let initialStartTime = 500;
   let startTime=initialStartTime; // Time the user takes to type the word (updated every millisecond).
   let timerRecorded=0; // timer record (updated every cents of second).
   let intervalID=0;// an ID for the Timer so that we can stop it.
   let allRecords = []; // Array of timer recorded.
   let lastWasDead = false; // Trick for ô style double strokes
   let currentUser = DEFAULTNAME;
   let success = false;
   let gameStarted = false;
   
   /*********************************************
    * CONSTANTS
   ********************************************/
  const apiUrl = "https://random-word-api.herokuapp.com";
  const usersArray = [];
  const penaltyMap = new Map();
  const pointsMap = new Map();
  const levelMap = new Map();
  const stageMap = new Map();
  const correctionPenalty = 1;
  const chickenPenalty = 2;
  const successPoint = 5;
  const charLevelMap = new Map();
  charLevelMap.set(0, 160);
  charLevelMap.set(1, 80);
  charLevelMap.set(2, 50);
  charLevelMap.set(3, 20);

    /**
     * get the HTML elements
     */
    const randomWordP = document.querySelector('#randomword');// get the html element for randWord
    const timerP = document.querySelector("#timer");// get the timer P element
    const startBtn = document.querySelector('#startgame');// start button
    const allRecordsOL = document.querySelector('#allRecords'); // list of records
    const leaderboard = document.querySelector('#leaderboard'); // list of records
    const nbWordInput = document.querySelector("#nb");
    const lengthInput = document.querySelector("#len");//==> EXPLAIN THIS LINE OF CODE
    const languagesContainer = document.querySelector("#languages");
    const typeWordP = document.querySelector('#typedword');// get the html element for user typed
    const addUser = document.querySelector('#addUser');// get the html element for user typed
    const users = document.querySelector('#users');// get the html element for user typed
    const userinput = document.querySelector('#userinput');// get the html element for user typed
    let langs = [];
   
    const initializeFuntion = (data)=>{ // Only when we got the languages can we start the Game.
        langs = data;
        // console.log(langs);
       createLanguageButtons(langs); // Add the radios to the page
       currentUser = DEFAULTNAME;
       console.log(currentUser, usersArray);
       initUser(currentUser);
       addUser.addEventListener('click', e =>{
        console.log('click', currentUser);
        initUser(userinput.value);

    });
       users.addEventListener('change',(e)=>{
        stopGame(false);
        currentUser = users.value;

        const stage = stageMap.get(currentUser);
        nbWordInput.value = stage.contWords;
        lengthInput.value = stage.wordLength;
        
        console.log(stageMap);
       
    });
       nbWordInput.addEventListener('click',onNumstepperChange);
       lengthInput.addEventListener('click',onNumstepperChange);
       typeWordP.addEventListener('input',onInput);
       startBtn.addEventListener('click',startGame); // listen to click on start button
       // Add an event listener to listen to keyboard type.
        document.addEventListener('keydown', onKey);
    }
    const onNumstepperChange = (e)=>{
            const stage = stageMap.get(currentUser);
            stageMap.set(currentUser, {
               contWords: parseInt(nbWordInput.value), 
                wordLength: parseInt(lengthInput.value)}
            );
        }
    const initUser = (u)=>{
        console.log('initUser', u);
        if (usersArray.indexOf(u) == -1) {
            if (usersArray.indexOf(DEFAULTNAME) == 0) {
                usersArray.length = 0;
            }
            usersArray.push(u);
            const o = document.createElement('option');
            o.value = u;
            o.textContent = u;
            if(u == DEFAULTNAME){
                o.disabled= true;
            }
            users.appendChild(o);
            users.selectedIndex = users.children.length - 1;
            initMaps(u);
        } else {
            alert(`${u} already exists, find another name !`);
        }
    };
    /**
     * 
     * @param {Event} event 
     */
    const onKey = (event) => {
        // event.preventDefault();
        event.stopPropagation();
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
                const p = penaltyMap.get(currentUser);
                penaltyMap.set(currentUser, penaltyMap.get(currentUser) + correctionPenalty);
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
    const initUI=()=>{
        console.log('initUI');
        const stage = stageMap.get(currentUser);
        nbWordInput.value = stage.contWords;
        lengthInput.value = stage.wordLength;
        timerP.classList = [];
        typeWordP.focus();
    }
    /**
     * 
     */
    async function startGame(){
        clearInterval(intervalID); // Reset the interval loop
        initUI();
        // Get language
        await initWords();
        // Add a chicken penatly if the user relaunch the game with finishin, or if another user launch and not finished.
        if(!success && (startTime != initialStartTime)){
            penaltyMap.set(currentUser, penaltyMap.get(currentUser) + chickenPenalty);
        }
        
        initMaps(currentUser);
        // Set the initial time based on the user level.
        initialStartTime = randomWords.length * charLevelMap.get(levelMap.get(currentUser)) + 20;
        timerRecorded = 0; // Init times.
        startTime = initialStartTime;
        // Start the timer.
        intervalID = setInterval(updateTimer,10);
        // Stop blinking
        gameStarted = true;
    }

    /**
     * 
     */
    const initMaps=(user)=> {
        if (!penaltyMap.has(user)) {
            penaltyMap.set(user, 0);
        }
        if (!pointsMap.has(user)) {
            pointsMap.set(user, 0);
        }
        if (!levelMap.has(user)) {
            levelMap.set(user, 0);
        }
        if (!stageMap.has(user)) {
            stageMap.set(user, {contWords:1, wordLength:2});
        }
    }

    async function initWords() {
        const langInput = document.querySelector("[name='lang']:checked");
        // Fetch the random from the API.
        const wordsArray = await getRandomWord(lengthInput.value, nbWordInput.value, langInput.value);
        randomWords = wordsArray.join(" ");
        randomWordP.textContent = randomWords; // put the random word in the P element
        // Resetting 
        typeWordP.innerHTML = typeWordP.value = "";
    }

    /**
     * => Explain
     * @param {Number} lngth 
     * @param {Number} nmber 
     * @param {String} lng 
     * @returns {String}
     */
    async function getRandomWord(lngth, nmber, lng){
        // String interpolated url with parameters as variables
        const search = `length=${lngth}&number=${nmber}&lang=${lng}`;
        const data = await callApi('word', search);
        return data;
    }
    /**
     * 
     * @returns 
     */
    async function getLanguages() {
        const data = callApi('languages');
        return data;
    }
    async function callApi(path, search='') {
        let url = `${apiUrl}/${path}`;
        if(search !=''){
            url += `?${search}`;
        }
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
        timerRecorded = (startTime--/100).toFixed(2); // start time with 2 digit format 1.000001 = 1.00
        timerP.textContent = "time: " +  timerRecorded +" s";
        if(timerRecorded <=0){
            stopGame(false);
        }
    }
    /**
     * ==> EXPLAIN what the function startGame() does
     * @param {Event} event
     */
    const onInput = (event)=>{
        console.log(intervalID);
        let typedString = typeWordP.textContent;
        
        if(gameStarted){
            if(event==null){
                typedString = typedString.slice(-1);
            }
            if(!lastWasDead){
                randomWordP.innerHTML = wordHighlighter(typedString);
            }
            checkWord(typedString);    
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
        for (let i = 0; i < text.length; i++) {
            // Loop through all char of typed and compare to the current word
            // and replace spaces by non breaking spaces...
            const charA = text[i].replace(/ /g, '\u00A0').charCodeAt(0);
            const charB = randomWords[i].replace(/ /g, '\u00A0').charCodeAt(0);
    
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
            success = true;
            stopGame(success);
            updateRecordsBoard(typed);
        }
    }
    /**
     * 
     * @param {*} typed 
     */
    const updateRecordsBoard = (typed)=>{
        allRecords.push( {time: timerRecorded, word:typed, user:currentUser });
        allRecords.sort((a, b) => a.time - b.time);
        allRecords = allRecords.slice(0, 6); // reduce the size of the array to 6 max
        allRecordsOL.innerHTML = "";
        allRecords.forEach(element => {
            const li = document.createElement("li");
            li.textContent = `${element.time}s ${element.user}`;
            li.classList.add('tooltip');
            li.setAttribute('data-tooltip', `Word(s): ${element.word}`);
            allRecordsOL.appendChild(li);
        });
    };
    /**
     * 
     */
    const updateLeaderBoard = ()=>{
        leaderboard.innerHTML = ""; // Reset list
        for ( let i in usersArray ){
            const user = usersArray[i];
            upgradeUser(user);
            const li = document.createElement("li");
            li.textContent = `${user} ${pointsMap.get(user)}`;
            li.classList.add('tooltip');
            li.setAttribute('data-tooltip', `level ${levelMap.get(user)}`);
            leaderboard.appendChild(li);
        }
    }
    /**
     * 
     * @param {*} user 
     */
    const upgradeUser = (user)=>{
        let userLevel = levelMap.get(user);
        if(pointsMap.get(user) - 10*(userLevel+1) > 0){
            
            stageMap.set(currentUser, {contWords:++stage.contWords, wordLength: stage.wordLength});
            levelMap.set(user, ++userLevel);
        }
    }
    /**
     * 
     * @param {*} success 
     */
    const stopGame = (success) =>{
        gameStarted = false;
        if(success){
            timerP.classList.add('correct');
            const stage = stageMap.get(currentUser);
            stageMap.set(currentUser, {contWords:stage.contWords, wordLength:++stage.wordLength});
            pointsMap.set(currentUser, pointsMap.get(currentUser) + successPoint);
        }else{
            timerP.classList.add('wrong');
        }
        updateLeaderBoard();
        clearInterval(intervalID);
        timerP.classList.add("blink");
        typeWordP.blur();
    }
    // Initialize the game.
    getLanguages().then(initializeFuntion).catch(
        (whyRejected)=>{
            alert(whyRejected);
        }
    );
}
