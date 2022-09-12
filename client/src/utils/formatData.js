// Calculate profit/loss and holdings for each transaction in current portfolio
// as well as total profit/loss
const calculateProfitLossHoldings = (transactions) => {
    let totalProfitLoss = 0
    const calculated = transactions.map(t => {
        // unformatted profit/loss. Formatting turns number into a string
        // which will mess up the total profit loss addition
        const profitLossUnf = (t.price - t.initial_price) * t.asset_amount;
        totalProfitLoss += profitLossUnf
        const holdings = (t.asset_amount * t.price);
        const initialHoldings = (t.asset_amount * t.initial_price);
        // merge calculated values with transaction data
        return {
            ...t,
            profitLossUnf,
            holdings,
            initialHoldings
        }
    })
    return {calculated, totalProfitLoss}
}

// Calculate current total worth and initial total worth of portfolio
const calculateTotalWorth = (assets) => {
    let worth = 0
    let initial = 0
    for (let i = 0; i < assets.length; i++) {
        // Format asset price decimal places
        assets[i].price = formatPPC(parseFloat(assets[i].price))
        worth += assets[i].asset_amount * assets[i].price;
        initial += assets[i].asset_amount * assets[i].initial_price;
    }
    return {
        worth,
        initial
    }
}

// Calculates percent change between current price and initial price 
// asset was purchased at
const calculatePercentChange = (current, initial) => {
    return (((current - initial) / initial) * 100).toFixed(2)
}

const mergeTransactions = (transactions) => {
    let mergedTransactions = transactions.reduce((accumulator, cur) => {
        let uuid = cur.uuid, found = accumulator.find(elem => {
            return elem.uuid === uuid
        });
        if (found) {
            found.profitLossUnf += cur.profitLossUnf;
            found.holdings += cur.holdings;
            found.initialHoldings += cur.initialHoldings;
            found.asset_amount += cur.asset_amount;
        }
        else accumulator.push(cur);
        return accumulator;
    }, []);
    return mergedTransactions;
}

const sortAssets = (a, b) => {
    if (a.holdings < b.holdings) return 1;
    if (a.holdings > b.holdings) return -1;
    return 0;
}

const formatPPC = (num) => {
	if (num >= 1) return num.toFixed(2)
	else if (num < 1 && num > 0.1) return num.toFixed(4)
	else if (num < 0.1 && num > 0.01) return num.toFixed(5)
	else if (num < 0.01 && num > 0.001) return num.toFixed(6)
	else if (num < 0.001 && num > 0.0001) return num.toFixed(7)
	else if (num < 0.0001 && num > 0.00001) return num.toFixed(8)
	else if (num < 0.00001 && num > 0.000001) return num.toFixed(9)
	else return num.toFixed(12)
}

const formatNumber = (num) => {
    num = parseFloat(num)
    if (num >= 1 || num === 0) return num.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2})
	else if (num < 1 && num > 0.1) return num.toLocaleString(undefined, {maximumFractionDigits: 4, minimumFractionDigits: 4})
	else if (num < 0.1 && num > 0.01) return num.toLocaleString(undefined, {maximumFractionDigits: 5, minimumFractionDigits: 5})
	else if (num < 0.01 && num > 0.001) return num.toLocaleString(undefined, {maximumFractionDigits: 6, minimumFractionDigits: 6})
	else if (num < 0.001 && num > 0.0001) return num.toLocaleString(undefined, {maximumFractionDigits: 7, minimumFractionDigits: 7})
	else if (num < 0.0001 && num > 0.00001) return num.toLocaleString(undefined, {maximumFractionDigits: 8, minimumFractionDigits: 8})
	else if (num < 0.00001 && num > 0.000001) return num.toLocaleString(undefined, {maximumFractionDigits: 9, minimumFractionDigits: 9})
	else return num.toLocaleString(undefined, {maximumFractionDigits: 12, minimumFractionDigits: 12})
}

const formatPercent = (num) => {
    num = parseFloat(num)
    if (num % 1 === 0) return num.toLocaleString(undefined, {maximumFractionDigits: 0})
    else return num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
}

const formatNumberV2 = (price) => {
    price = parseFloat(price);
    if (price === null) price = 'Unlimited';
    else if (price > 1 ) price = price.toLocaleString(undefined, {maximumFractionDigits: 2});
    else if (price < 1 && price > 0.0001) price = price.toLocaleString(undefined, {minimumFractionDigits: 4});
    else price = price.toLocaleString(undefined, {minimumFractionDigits: 8});
    return price;
}

const formatData = {
    calculateProfitLossHoldings,
    calculatePercentChange,
    calculateTotalWorth,
    mergeTransactions,
    sortAssets,
    formatNumber,
    formatNumberV2,
    formatPPC,
    formatPercent
}

export default formatData