// DOM Initialization.
window.onload = () => {
  // Variables
  let rows = 0;
  let cols = 0;
  const primary = "&nbsp;"; // Initial char.

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
  const ballChanger=(e)=>{
    console.log(e);
    console.log(e.target);
  }
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
  console.log(cols, rows);
}