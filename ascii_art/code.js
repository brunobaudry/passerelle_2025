// DOM Initialization.
window.onload = () => {
  // Variables
  let rows = 0;
  let cols = 0;
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
  calculateGridSize();
  console.log(cols, rows);
}