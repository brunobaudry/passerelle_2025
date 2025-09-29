const BASE_URL = 'https://the-one-api.dev/v2';
const API_TOKEN = 'OAfU5Y2_Erm2diPjRTlG'; // Replace with your actual token

fetchData('character?name=Belemir');
// Generic fetch function
async function fetchData(endpoint) {
  fetch(`${BASE_URL}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    }
  })
  .then(response =>response.json())
  .then(data => {
    console.log(data);
    displayData(data.docs, endpoint);
  })
  .catch(error => {
    console.error(`Error fetching ${endpoint}:`, error);
  });
}

// Display function
async function displayData(items, type) {
  const list = document.getElementById('dataList');
  list.innerHTML = ''; // Clear previous entries

  items.slice(0, 100).forEach(item => {
    const li = document.createElement('li');
    switch (type) {
      case 'movie':
        li.textContent = `${item.name} (${item.runtimeInMinutes} min)`;
        break;
      case 'quote':
        li.textContent = `"${item.dialog}" — ${item.character}`;
        li.setAttribute('data-targetid',`${item.character}`);
        li.setAttribute('data-type','quote');
        li.setAttribute('data-tagrget','character');
        break;
      case 'character':
        li.textContent = item.name || 'Unnamed Character';
        break;
      case 'book':
        li.textContent = item.name;
        break;
      case 'chapter':
        li.textContent = `${item.chapterName} (Book ID: ${item.book})`;
        li.setAttribute('data-targetid',`${item.book}`);
        li.setAttribute('data-type','chapter');
        li.setAttribute('data-tagrget','book');
        break;
      default:
        li.textContent = JSON.stringify(item);
    }
    list.appendChild(li);
  });
}
