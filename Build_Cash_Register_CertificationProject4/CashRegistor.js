let price = 3.26;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const dueChangeDiv = document.getElementById('change-due');
const cash = document.getElementById('cash');
const purchaseBtn = document.getElementById('purchase-btn');
const priceDashboard = document.getElementById('price-dashboard');
const displayDrawer = document.getElementById('display-drawer');

function checkCash () {
    if (Number(cash.value) < price) {
      alert('Customer does not have enough money to purchase the item');
      return;
    }
  
    if (Number(cash.value) === price) {
      dueChangeDiv.innerHTML =
        '<p>No change due - customer paid with exact cash</p>';
      return;
    }
  
    let changeDue = Number(cash.value) - price;
    let reversedCid = [...cid].reverse();
    let cidObj2 = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
    let result = { status: 'OPEN', change: [] };
    let totalCID = parseFloat(
      cid
        .map(all => all[1])
        .reduce((acc, adds) => acc + adds)
        .toFixed(2)
    );
  
    if (totalCID < changeDue) {
      return (dueChangeDiv.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>');
    }
  
    if (totalCID === changeDue) {
      result.status = 'CLOSED';
    }

    for (let i = 0; i <= reversedCid.length; i++) {
      if (changeDue >= cidObj2[i] && changeDue > 0) {
        let count = 0;
        let all = reversedCid[i][1];
        while (all > 0 && changeDue >= cidObj2[i]) {
          all -= cidObj2[i];
          changeDue = parseFloat((changeDue -= cidObj2[i]).toFixed(2));
          count++;
        }
        if (count > 0) {
          result.change.push([reversedCid[i][0], count * cidObj2[i]]);
        }
      }
    }

    if (changeDue > 0) {
        return (dueChangeDiv.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>');
      }
    
      makeResult(result.status, result.change);
      newUpdates(result.change);
  };
  

function makeResult(status, change) {
  dueChangeDiv.innerHTML = `<p>Status: ${status}</p>`;
  change.map(
    wallet => (dueChangeDiv.innerHTML += `<p>${wallet[0]}: $${wallet[1]}</p>`)
  );
  return;
};

const testResults = () => {
  if (!cash.value) {
    return;
  }
  checkCash();
};

const newUpdates = change => {
  const currencyUnitNames = {
    PENNY: 'Pennies',
    NICKEL: 'Nickels',
    DIME: 'Dimes',
    QUARTER: 'Quarters',
    ONE: 'Ones',
    FIVE: 'Fives',
    TEN: 'Tens',
    TWENTY: 'Twenties',
    'ONE HUNDRED': 'Hundreds'
  };

  if (change) {
    change.forEach(newArr => {
      const targetArr = cid.find(cidArr => cidArr[0] === newArr[0]);
      targetArr[1] = parseFloat((targetArr[1] - newArr[1]).toFixed(2));
    });
  }

  cash.value = '';
  priceDashboard.textContent = `Total: $${price}`;
  displayDrawer.innerHTML = `<p><strong>Change in drawer:</strong></p>
    ${cid
      .map(wallet => `<p>${currencyUnitNames[wallet[0]]}: $${wallet[1]}</p>`)
      .join('')}  
  `;
};

purchaseBtn.addEventListener('click', testResults);

cash.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    testResults();
  }
});

newUpdates();