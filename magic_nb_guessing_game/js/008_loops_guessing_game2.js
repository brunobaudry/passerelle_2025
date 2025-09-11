////////////////////////////////
/**
 * TODO:
 * - Add distance for better messaging/gaming experience.
 * - Add "try again" proposal at the end of the game. 
 * - Get the number limits and the tries from the URL.
 * - Replace alert and prompts with html and slick looking css.
 * - Make the game look nice :
 *      -- Nice font.
 *      -- Color palette of you choice.
 *      -- Display More info like number of tries.
 */
////////////////////////////////
const debug = true;
const trysNbr = 3;
const limitHigh = 10;
const limitlow = 1;
let tried = 0;
let random = Math.random();// Get a random number.
random = random * (limitHigh - limitlow) ; // Multiply by the desired range.
random = Math.floor(random); // Get the absolute value. (removing floating point value)
random = random + limitlow; // Re arrange from the lower limit.
let goodByeString = `YOU LOOSE! 😢 ${random} was the correct answer ...`;
//
this.onload = ()=>{
    const instruct1 = `Number between ${limitlow} and ${limitHigh} guessing game ${(debug?`(${random})`:'')}`
    const instructParagph = document.querySelector('#instructions');
    instructParagph.textContent = instruct1;
    const userGuessInput = document.querySelector('#userGuess');
    const submitBtn = document.querySelector('#submit');
    submitBtn.addEventListener('click',
        (e)=>{myGame(e);}
    )
    function myGame(e){
        console.log(userGuessInput.value, random);
        const userGuess = userGuessInput.value;
        if(tried < trysNbr){
            tried++;
            if(userGuess == null){
                const chicken = confirm(`Are you chickening out? ("Ok" if YES "Cancel" if NO)`);
                if(chicken){
                    instructParagph.textContent(`Glad you are being honest, I give you one more trial`);
                    tried--;
                }
            } else if(userGuess == random){
                instructParagph.textContent = `🎉 Well done you found ${random} in ${tried} tries`;
            }else{ //Correct number not found.
                if (userGuess > limitHigh || userGuess < limitlow){ // Out of the limits.
                    instructParagph.textContent = (`${userGuess} is not in the limit, stupid !!! I asked between ${limitlow} and ${limitHigh}`);
                }
                else if( userGuess < random ){
                    instructParagph.textContent = (`${userGuess} is too low`);
                }
                else{
                    instructParagph.textContent = (`too high`);
                }
            } 
        }else{
            instructParagph.textContent = goodByeString
        }
    }
}