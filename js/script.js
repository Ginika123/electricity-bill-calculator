const historyTable = document.getElementById("historyTable");
const darkModeBtn = document.getElementById("darkModeBtn");

loadHistory();

/* DARK MODE */
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-mode")
        ? "dark"
        : "light"
    );
});

/* LOAD THEME */
window.addEventListener("load", () => {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }
});

/* CALCULATE BILL */
function calculateBill() {

    const customerName = document.getElementById("customerName").value.trim();
    const meterNumber = document.getElementById("meterNumber").value.trim();
    const units = Number(document.getElementById("units").value);

    if (customerName === "" || meterNumber === "" || units <= 0 || isNaN(units)) {
        alert("Please enter valid information.");
        return;
    }

    let rate;

    if (units <= 100) {
        rate = 50;
    } else if (units <= 300) {
        rate = 75;
    } else {
        rate = 100;
    }

    const energyCharge = units * rate;
    const serviceCharge = 500;
    const totalBill = energyCharge + serviceCharge;

    document.getElementById("result").innerHTML = `
        <h2>Bill Summary</h2>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Meter:</strong> ${meterNumber}</p>
        <p><strong>Units:</strong> ${units}</p>
        <p><strong>Rate:</strong> ₦${rate}</p>
        <p><strong>Energy Charge:</strong> ₦${energyCharge}</p>
        <p><strong>Service Charge:</strong> ₦${serviceCharge}</p>
        <p><strong>Total Bill:</strong> ₦${totalBill}</p>
    `;

    const billRecord = {
        date: new Date().toLocaleDateString(),
        customerName,
        units,
        totalBill
    };

    saveHistory(billRecord);

    /* ✅ CLEAR INPUTS */
    document.getElementById("customerName").value = "";
    document.getElementById("meterNumber").value = "";
    document.getElementById("units").value = "";

    document.getElementById("customerName").focus();
}

/* SAVE HISTORY */
function saveHistory(record) {

    let history = JSON.parse(localStorage.getItem("billHistory")) || [];

    history.push(record);

    localStorage.setItem("billHistory", JSON.stringify(history));

    loadHistory();
}

/* LOAD HISTORY */
function loadHistory() {

    let history = JSON.parse(localStorage.getItem("billHistory")) || [];

    historyTable.innerHTML = "";

    history.forEach(item => {
        historyTable.innerHTML += `
            <tr>
                <td>${item.date}</td>
                <td>${item.customerName}</td>
                <td>${item.units}</td>
                <td>₦${item.totalBill}</td>
            </tr>
        `;
    });

    updateStatistics();
}

/* STATS */
function updateStatistics() {

    let history = JSON.parse(localStorage.getItem("billHistory")) || [];

    if (history.length === 0) {
        document.getElementById("totalBills").textContent = 0;
        document.getElementById("highestBill").textContent = "₦0";
        document.getElementById("lowestBill").textContent = "₦0";
        document.getElementById("averageBill").textContent = "₦0";
        return;
    }

    const totals = history.map(item => item.totalBill);

    document.getElementById("totalBills").textContent = history.length;
    document.getElementById("highestBill").textContent = "₦" + Math.max(...totals);
    document.getElementById("lowestBill").textContent = "₦" + Math.min(...totals);

    const average = totals.reduce((a, b) => a + b, 0) / totals.length;

    document.getElementById("averageBill").textContent =
        "₦" + average.toFixed(2);
}

/* CLEAR HISTORY */
function clearHistory() {

    if (confirm("Delete all history?")) {
        localStorage.removeItem("billHistory");
        loadHistory();
    }
}

/* SEARCH */
function searchHistory() {

    const value = document.getElementById("searchInput").value.toLowerCase();

    const rows = document.querySelectorAll("#historyTable tr");

    rows.forEach(row => {
        row.style.display =
            row.textContent.toLowerCase().includes(value)
                ? ""
                : "none";
    });
}

/* PRINT */
function printReceipt() {
    window.print();
}

/* DOWNLOAD */
function downloadReceipt() {

    const text = document.getElementById("result").innerText;

    const blob = new Blob([text], { type: "text/plain" });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "Electricity-Bill-Receipt.txt";

    link.click();
}