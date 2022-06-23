const calculateProfitLossHoldings = (transactions) => {
    const calculated = transactions.map(t => {
        const profitLossUnf = (t.price - t.initial_price) * t.asset_amount;
        const holdings = (t.asset_amount * t.price);
        const initialHoldings = (t.asset_amount * t.initial_price);
        return {
            ...t,
            profitLossUnf,
            holdings,
            initialHoldings
        }
    })
    return calculated
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

const formatNumber = (price) => {
    price = parseFloat(price);
    if (price === null) price = 'Unlimited';
    else if (price >= 1 ) price = price.toLocaleString(undefined, {maximumFractionDigits: 2});
    else if (price < 1 && price > 0.001) price = price.toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
    else if (price === 0) price = 0;
    else price = price.toLocaleString(undefined, {minimumFractionDigits: 4, maximumFractionDigits: 8})
    return price;
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
    mergeTransactions,
    sortAssets,
    formatNumber,
    formatNumberV2
}

export default formatData