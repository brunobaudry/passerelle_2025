// DOM Initialization.
window.onload = () => {
  // Variables
  let rows = 0;
  let cols = 0;
  let currentHue = Math.floor(Math.random() * 360); // Start with a random hue.
  // Constants
const timeout = 200; //EDIT
const timeout2 = 300; //EDIT
const timeout3 = 400; //EDIT
  const primary = "&nbsp;"; // Initial char.
// First 
const center = ['@', '®', '©',]; //EDIT
const tertiary = ['.', '*', '•', '°']; //EDIT
const secondary = ['\\', '/', '|', '-', '_','&boxv;','&boxh;','&boxvl;','&boxvl;','&boxhd;','&boxhu;']; //EDIT
const max = 2; // First circle around center.
const max2 = 5; // 2nd circle around center.

  const calculateGridSize = () => {
      // Create a test SPAN.
    const testSpan = document.createElement('span');
    testSpan.innerHTML = '&nbsp;';
    testSpan.style.visibility = 'hidden';
    document.body.appendChild(testSpan);
  // Compute the cell size.
    const cellWidth = testSpan.offsetWidth;
    const cellHeight = testSpan.offsetHeight;
  // NO MORE NEEDED, REMOVE
    document.body.removeChild(testSpan);
    cols = Math.floor(window.innerWidth / cellWidth) + 4;
    rows = Math.floor(window.innerHeight / cellHeight) + 1;
  };
  /**
   * Main function to identify and modify the cells around the mouse hover.
   * 
   * @param {Event} e 
   */
  const ballChanger=(e)=>{
    // console.log(e);
    console.log(e.target);
    currentHue += 2; //EDIT
    // GRAB the span id and divide it by -
    // idXX YY
    const [rowStr, colStr] = e.target.id.split('-');
    // remove 'id'
    const x = Number(rowStr.slice(2));
    const y = Number(colStr);
    for (let k = 0; k < rows; k++) { // Loop the rows.
      for (let l = 0; l < cols; l++) { // loop the columns.
        const item = document.querySelector(`#id${k}-${l}`); // Select the cell.
        if (!item) {
          // Skipp if error
          continue;
        }
        // Compute Euclidian distance from K,l to x,y
        const distance = Math.sqrt((k - x) ** 2 + (l - y) ** 2);
        console.log(distance);
        if (distance === 0) {
          animateItem(item, randomFromArray(center), timeout * Math.random() +timeout, 'shadow');
        } else if (distance <= max) {
          animateItem(item, randomFromArray(tertiary), timeout2 * Math.random() + timeout2, `circle${k % 3}`);
        } else if (distance <= max2) {
          animateItem(item, randomFromArray(secondary), timeout3 * Math.random() + timeout3, `circle${k % 3}`);
        }
      }
    }
  }
    // Utility: Get a random item from an array.
    // Returns a random element from the given array.
    const randomFromArray = arr => arr[Math.floor(Math.random() * arr.length)];
    /**
     * Animation logic.
     * 
     * @param {HTMLElement} item 
     * @param {String} char 
     * @param {Int} delay 
     * @param {String} extraClass 
     */
    const animateItem = (item, char, delay, extraClass) => {
      // Launch a function with delay to make the start status of the cell.
      setTimeout(() => {
        item.innerHTML = char; //Set the text content.
        // Colors.
        item.style.backgroundColor = `hsla(${currentHue%360}, 100%, 30%, .8)`; //EDIT
        item.style.color = `hsla(${(currentHue + 180) % 360}, 100%, 70%, 1)`;//EDIT
        item.classList.add(extraClass);
      }, delay);
        // Launch a function with delay to make the end status of the cell.
      setTimeout(() => {
        item.innerHTML = primary; // Get back to the initial char. 
        item.style.backgroundColor = `hsla(${currentHue%360}, 100%, 50%, 0)`; //EDIT
        item.classList.remove(extraClass);
      }, delay * 1.5);
    };
    /**
     * 
     * @returns void
     */
    const buildBrid = ()=>{
      // Build the grid.
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const span = document.createElement('span');
          span.id = `id${i}-${j}`; // name from x,y.
          span.innerHTML = primary; // fill it in with the initial character.
          span.addEventListener('mouseover', ballChanger);
          // Add the cell.
          document.body.appendChild(span);
        }
        // new line.
        document.body.appendChild(document.createElement('br'));
      }
    }
  calculateGridSize();
  buildBrid();
  // console.log(cols, rows);
}