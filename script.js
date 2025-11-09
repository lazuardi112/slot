// --- DOM Elements ---
const spinButton = document.getElementById('spin-button');
const reelCols = document.querySelectorAll('.reel-col');
const messageContainer = document.getElementById('message-container');
const balanceDisplay = document.getElementById('balance-display');
const betDisplay = document.getElementById('bet-display');
const winDisplay = document.getElementById('win-display');
const increaseBetButton = document.getElementById('increase-bet');
const decreaseBetButton = document.getElementById('decrease-bet');

// --- Game State ---
let balance = 100000;
let currentBet = 1000;
const betIncrement = 500;
const symbols = ["🏺", "🛡️", "🔱", "🏛️", "⚡️", "🏺", "🛡️", "🔱"]; // 🏛️ is WILD, ⚡️ is Zeus (high value)

// --- Event Listeners ---
spinButton.addEventListener('click', spin);
increaseBetButton.addEventListener('click', increaseBet);
decreaseBetButton.addEventListener('click', decreaseBet);

// --- Initialization ---
updateDisplays();

// --- Functions ---

function formatRupiah(amount) {
    return `Rp ${amount.toLocaleString('id-ID')}`;
}

function updateDisplays() {
    balanceDisplay.textContent = formatRupiah(balance);
    betDisplay.textContent = `Taruhan: ${formatRupiah(currentBet)}`;
    winDisplay.textContent = formatRupiah(0); // Reset win display initially
}

function increaseBet() {
    if (currentBet < 5000) { // Max bet
        currentBet += betIncrement;
        betDisplay.textContent = `Taruhan: ${formatRupiah(currentBet)}`;
    }
}

function decreaseBet() {
    if (currentBet > 500) { // Min bet
        currentBet -= betIncrement;
        betDisplay.textContent = `Taruhan: ${formatRupiah(currentBet)}`;
    }
}

function spin() {
    if (balance < currentBet) {
        showMessage("SALDO TIDAK CUKUP!");
        return;
    }

    // --- Pre-spin updates ---
    spinButton.disabled = true;
    balance -= currentBet;
    balanceDisplay.textContent = formatRupiah(balance);
    winDisplay.textContent = formatRupiah(0);
    showMessage('', true);

    // --- Spin animation ---
    let finalGrid = [];
    reelCols.forEach((col, colIndex) => {
        finalGrid[colIndex] = [];
        const symbolsInCol = col.querySelectorAll('.symbol');
        const interval = setInterval(() => {
            symbolsInCol.forEach(symbolEl => {
                symbolEl.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            });
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            symbolsInCol.forEach((symbolEl, rowIndex) => {
                const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                symbolEl.textContent = finalSymbol;
                finalGrid[colIndex][rowIndex] = finalSymbol;
            });

            // Check for win after the last column stops
            if (colIndex === reelCols.length - 1) {
                checkWin(finalGrid);
                spinButton.disabled = false;
            }
        }, 1000 + colIndex * 400); // Stagger column stops
    });
}

function checkWin(grid) {
    let totalWin = 0;
    const numRows = 4;
    const numCols = 5;

    // --- Check wins row by row ---
    for (let r = 0; r < numRows; r++) {
        let rowStr = "";
        for (let c = 0; c < numCols; c++) {
            // grid is col-major, so we access it as grid[c][r]
            rowStr += grid[c][r];
        }

        // Check for 5 of a kind
        if (/^(.)\1\1\1\1$/.test(rowStr)) totalWin += getPayout(rowStr[0]) * 10;
        // Check for 4 of a kind
        else if (/^(.)\1\1\1/.test(rowStr) || /.(.)\1\1\1$/.test(rowStr)) totalWin += getPayout(rowStr[0]) * 5;
        // Check for 3 of a kind
        else if (/^(.)\1\1/.test(rowStr) || /.(.)\1\1./.test(rowStr) || /..(.)\1\1$/.test(rowStr)) totalWin += getPayout(rowStr[0]) * 2;
    }

    // --- Update balance and display winnings ---
    if (totalWin > 0) {
        balance += totalWin;
        balanceDisplay.textContent = formatRupiah(balance);
        winDisplay.textContent = formatRupiah(totalWin);

        // Determine win type for animation
        if (totalWin > currentBet * 10) {
            showMessage("SUPER WIN! JACKPOT!");
        } else if (totalWin > currentBet * 5) {
            showMessage("BIG WIN!");
        } else {
            showMessage("WIN!");
        }
    } else {
        showMessage("Coba Lagi!");
    }
}

function getPayout(symbol) {
    const wild = "🏛️";
    const zeus = "⚡️";
    if (symbol === wild || symbol === zeus) {
        return currentBet * 2;
    }
    return currentBet / 2;
}


function showMessage(text, clear = false) {
    messageContainer.classList.remove('win-animation', 'big-win-animation', 'super-win-animation', 'message-reveal');

    if (clear) {
        messageContainer.textContent = '';
        return;
    }

    messageContainer.textContent = text;
    messageContainer.classList.add('message-reveal');

    if (text.includes("JACKPOT")) {
        messageContainer.classList.add('super-win-animation');
    } else if (text.includes("BIG WIN")) {
        messageContainer.classList.add('big-win-animation');
    } else if (text.includes("WIN!")) {
        messageContainer.classList.add('win-animation');
    }
}
