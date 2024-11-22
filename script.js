const apiURL = 'https://api.coinpaprika.com/v1/tickers';
let cryptoData = [];

// Get references
const searchInput = document.getElementById('crypto-search');
const cryptoDataDiv = document.getElementById('crypto-data');

// Fetch cryptocurrency data
async function fetchCryptoData() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        cryptoData = await response.json();
        displayCryptoData(cryptoData.slice(0, 50));
    } catch (error) {
        cryptoDataDiv.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    }
}

// Display cryptocurrencies
function displayCryptoData(data) {
    cryptoDataDiv.innerHTML = '';
    data.forEach(crypto => {
        const cryptoItem = document.createElement('div');
        cryptoItem.className = 'crypto-item col-md-6 col-lg-4';
        cryptoItem.innerHTML = `
            <div class="crypto-name">
                <h5>${crypto.name} (${crypto.symbol.toUpperCase()})</h5>
            </div>
            <div>
                <p>Price: $${crypto.quotes.USD.price.toFixed(2)}</p>
            </div>
        `;
        cryptoItem.addEventListener('click', () => {
            navigateToDetails(crypto);
        });
        cryptoDataDiv.appendChild(cryptoItem);
    });
}

// Navigate to details page
function navigateToDetails(crypto) {
    localStorage.setItem('selectedCrypto', JSON.stringify(crypto));
    window.location.href = 'details.html';
}

// Filter cryptocurrencies
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredData = cryptoData.filter(crypto =>
        crypto.name.toLowerCase().includes(query) || crypto.symbol.toLowerCase().includes(query)
    );
    displayCryptoData(filteredData);
});

// Initialize
fetchCryptoData();
