const fs = require("fs").promises;

// Calculate reward points for a purchase with detailed breakdown
function calculatePoints(amount) {
  let points = 0;
  let breakdownParts = [];

  if (amount > 100) {
    const over100 = amount - 100;
    points += over100 * 2;
    breakdownParts.push(`2x$${over100}`); // 2 points per dollar above 100

    const between50And100 = 50; // dollars between 50 and 100
    points += between50And100 * 1;
    breakdownParts.push(`1x$${between50And100}`);
  } else if (amount > 50) {
    const between50And100 = amount - 50;
    points += between50And100 * 1;
    breakdownParts.push(`1x$${between50And100}`);
  }

  if (breakdownParts.length === 0) breakdownParts.push("0 points");

  return { points, breakdown: breakdownParts.join(" + ") };
}

// Simulated async API call
async function fetchTransactions() {
  const data = await fs.readFile("transactions.json", "utf-8");
  await new Promise((res) => setTimeout(res, 500));
  return JSON.parse(data);
}

// Group transactions by customer
function groupTransactionsByCustomer(transactions) {
  const customers = {};
  transactions.forEach((tx) => {
    if (!customers[tx.customer]) customers[tx.customer] = [];
    customers[tx.customer].push(tx);
  });
  return customers;
}

// Main function
async function main() {
  console.log("Fetching transactions...\n");
  const transactions = await fetchTransactions();

  const customers = groupTransactionsByCustomer(transactions);

  for (const [customer, txs] of Object.entries(customers)) {
    console.log(`==============================`);
    console.log(`Customer: ${customer}`);
    console.log(`------------------------------`);

    let totalPoints = 0;

    txs.forEach((tx, index) => {
      const { points, breakdown } = calculatePoints(tx.amount);
      totalPoints += points;
      console.log(
        `Transaction ${index + 1}: $${tx.amount} on ${tx.date} → ${breakdown} = ${points} points`
      );
    });

    console.log(`------------------------------`);
    console.log(`Total Points for ${customer}: ${totalPoints}`);
    console.log(`==============================\n`);
  }
}

main();
