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
//   const apiUrl = "https://random-word-api.herokuapp.com"; // https://random-words-api.kushcreates.com/api
  const apiUrl = "https://random-words-api.kushcreates.com"; // https://random-words-api.kushcreates.com/api
  const usersArray = [];
  const penaltyMap = new Map();
  const pointsMap = new Map();
  const levelMap = new Map();
  const stageMap = new Map();
  const correctionPenalty = 1;
  const chickenPenalty = 3;
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
    const userLevelSpan = document.querySelector('#userlevel');// start button
    const allRecordsOL = document.querySelector('#allRecords'); // list of records
    const leaderboard = document.querySelector('#leaderboard'); // list of records
    const nbWordInput = document.querySelector("#nb");
    const lengthInput = document.querySelector("#len");//==> EXPLAIN THIS LINE OF CODE
    const languagesContainer = document.querySelector("#languages");
    const categoriesContainer = document.querySelector("#categories");
    const typeWordP = document.querySelector('#typedword');// get the html element for user typed
    const addUser = document.querySelector('#addUser');// get the html element for user typed
    const users = document.querySelector('#users');// get the html element for user typed
    const userinput = document.querySelector('#userinput');// get the html element for user typed
    let langs = [];
   
    const initializeFuntion = ()=>{ // Only when we got the languages can we start the Game.
       createOptions(['en', 'es', 'hi', 'gu', 'de', 'fr', 'it', 'zh', 'pt-br'], languagesContainer); // Add the radios to the page
       createOptions(['all', 'capitals_of_countries', 'countries', 'sports', 'animals', 'birds', 'softwares', 'programming_languages','games','pc_games','mobile_games','console_games','companies'], categoriesContainer); // Add the radios to the page
       currentUser = DEFAULTNAME;
       initUser(currentUser);
       addUser.addEventListener('click', e =>{
            console.log('click', currentUser);
            const user = userinput.value.trim();
            if(user !=='') initUser(userinput.value);
        });
       users.addEventListener('change',(e)=>{
        if(gameStarted) stopGame(false);
        currentUser = users.value;
        stageCurrentUser();
        resetWords();
        console.log(stageMap);
       
    });
       nbWordInput.addEventListener('click',onNumstepperChange);
       lengthInput.addEventListener('click',onNumstepperChange);
       typeWordP.addEventListener('input',onInput);
       startBtn.addEventListener('click',startGame); // listen to click on start button
       // Add an event listener to listen to keyboard type.
        document.addEventListener('keydown', onKey);
    }
    const stageCurrentUser = ()=>{
        const stage = stageMap.get(currentUser);
        userLevelSpan.textContent = `level ${levelMap.get(currentUser)}`;
        nbWordInput.value = stage.contWords;
        lengthInput.value = stage.wordLength;
        
    }
    const onNumstepperChange = (e)=>{
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
            currentUser = u;
            stageCurrentUser();
            resetWords();
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
                updatePenaltyMap(correctionPenalty);
                updateHearts();
                onInput(null);
            }
        }
    };
    const updatePenaltyMap = (value)=>{
        penaltyMap.set(currentUser, penaltyMap.get(currentUser) + value);
    }
    /**
     * Add the radios to the page.
     * @param {array} langs 
     */
    const createOptions = (langs, container)=>{
        // addRadioElements('en', true);
        for(let i = 0; i < langs.length; i++){
            addOptionElements(langs[i], i===0, container);
        }
    }
    /**
     * 
     * @param {String} lang 
     * @param {Boolean} first 
     */
    const addOptionElements = (lang, first, container)=>{
        // const label = document.createElement('label');
        // label.setAttribute('for',lang);
        // label.textContent = lang;
        // Create the input.<input type="radio" value="de" id="de" name="lang" checked/><br/>
        const input = document.createElement('option');
        //input.type = 'radio'; // input.setAttribute('type','radio'); // The type of input.
        input.innerHTML = lang; // What will be set as value
        input.setAttribute('id',lang);
        input.setAttribute('name',"lang"); // Same as same radio buttons
        input.checked = first;
        // Add the items to the radio container
        //languagesContainer.appendChild(label);
        container.appendChild(input);
        container.appendChild(document.createElement('br'));
    }
    const initUI=()=>{
        const stage = stageMap.get(currentUser);
        nbWordInput.value = stage.contWords;
        lengthInput.value = stage.wordLength;
        timerP.classList = [];
        userLevelSpan.classList = [];
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
        console.log(!success , startTime , initialStartTime, (startTime != initialStartTime), !success && (startTime != initialStartTime));
        if(!success && (startTime != initialStartTime)){
            updatePenaltyMap(chickenPenalty);
            updateHearts();
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
        //const storedOk = await storeData('user', currentUser);
        // console.log(storedOk);
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
    const resetWords = ()=>{
        randomWordP.innerHTML = '';
        typeWordP.innerHTML = typeWordP.value = '';
    }
    async function initWords() {
        // Fetch the random from the API.
        const wordsArray = await getRandomWord();
        randomWords = wordsArray.map((e)=>e.word).join(" ");
        resetWords();
        randomWordP.innerHTML = randomWords; // put the random word in the P element
    }

    /**
     * => Explain

     * @returns {String}
     */
    async function getRandomWord(){
        const langInput = document.querySelector("[name='lang']:checked");
        let search = '';
        if(lengthInput.value){
            search += `&length=${lengthInput.value}`;
        }
        if(nbWordInput.value){
            search += `&words=${nbWordInput.value}`;
        }
        if(langInput.value){
            search += `&language=${langInput.value}`;
        }
        if(categoriesContainer.value){
            search += `&category=${categoriesContainer.value}`;
        }
        // String interpolated url with parameters as variables
        // const search = `length=${lngth}&number=${nmber}&lang=${lng}`;
        // const search = `length=${lngth}&words=${nmber}&lang=${lng}`;
        const data = await callApi('api', search);
        // console.log(data);
        return data;
    }
    /**
     * 
     * @returns 
     */
    // async function getLanguages() {
    //     storeData('attempts', new Date().toISOString());
    //     //const data = callApi('languages');
    //     // const data = callApi('languages');
    //     const data = ['en', 'es', 'hi', 'gu', 'de', 'fr', 'it', 'zh', 'pt-br'];
    //     return data;
    // }
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
    async function storeData(name, values){
        let url = `/${name}`;
        const options = {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }
        const response = await fetch(url, options);
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
        for (let i = 0; i < Math.min(randomWords.length , text.length); i++) {
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
            const stage = stageMap.get(currentUser);
            stageMap.set(currentUser, {contWords:++stage.contWords, wordLength: stage.wordLength});
            levelMap.set(user, ++userLevel);
            userLevelSpan.classList.add("blink");
            stageCurrentUser();
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
            updatePenaltyMap(chickenPenalty);
            timerP.classList.add('wrong');
        }
        updateLeaderBoard();
        clearInterval(intervalID);
        timerP.classList.add("blink");
        typeWordP.blur();
        updateHearts();
    }
    const updateHearts = ()=>{
        const penalty = penaltyMap.get(currentUser)
        const totalHearts = 5;
        const maxPenalty = 50 * ( totalHearts - levelMap.get(currentUser));
        console.log(maxPenalty);
        const heartPenalty = maxPenalty / totalHearts; // 10 per heart

        for (let i = 0; i < totalHearts; i++) {
            const heart = document.getElementById(`heart${i}`);
            const start = i * heartPenalty;
            const end = (i + 1) * heartPenalty;

            if (penalty <= start) {
                // Heart is still full
                heart.style.opacity = 1;
            } else if (penalty >= end) {
                // Heart completely faded
                heart.style.opacity = 0;
            } else {
            // Heart partially faded within this penalty range
            const progress = (penalty - start) / heartPenalty;
            heart.style.opacity = 1 - progress;
            console.log(progress);
            }
        }
    }

    // Initialize the game.
    initializeFuntion();
}
