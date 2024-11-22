const cryptoNameElem = document.getElementById('crypto-name');
const cryptoInfoElem = document.getElementById('crypto-info');
const cryptoChartElem = document.getElementById('crypto-chart');
const crypto = JSON.parse(localStorage.getItem('selectedCrypto'));

if (crypto) {
    cryptoNameElem.textContent = `${crypto.name} (${crypto.symbol.toUpperCase()})`;
    cryptoInfoElem.innerHTML = `
        <p>Price: $${crypto.quotes.USD.price.toFixed(2)}</p>
        <p>24h Change: ${crypto.quotes.USD.percent_change_24h.toFixed(2)}%</p>
        <p>Market Cap: $${(crypto.quotes.USD.market_cap / 1e9).toFixed(2)} B</p>
        <p>Total Supply: ${crypto.total_supply}</p>
    `;

    // Generate real-time data for the chart
    const priceData = [crypto.quotes.USD.price]; // Start with the current price
    const labels = ['Now']; // Start with a single label
    let chart; // To store the chart instance

    // Function to update the graph with new data
    async function updateChart() {
        try {
            const response = await fetch(`https://api.coinpaprika.com/v1/tickers/${crypto.id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const updatedData = await response.json();

            // Add the new price and update labels
            priceData.push(updatedData.quotes.USD.price);
            labels.push(new Date().toLocaleTimeString());

            // Keep the graph length manageable
            if (priceData.length > 10) {
                priceData.shift();
                labels.shift();
            }

            // Update the chart
            chart.data.labels = labels;
            chart.data.datasets[0].data = priceData;
            chart.update();
        } catch (error) {
            console.error("Error updating chart:", error);
        }
    }

    // Create the initial chart
    chart = new Chart(cryptoChartElem, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `${crypto.name} Price (USD)`,
                data: priceData,
                borderColor: '#2a9d8f',
                borderWidth: 2,
                tension: 0.4,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                }
            }
        }
    });

    // Update the chart every 10 seconds
    setInterval(updateChart, 10000);
} else {
    cryptoInfoElem.textContent = 'No cryptocurrency selected!';
}
