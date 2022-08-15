import formatData from '../utils/formatData'

it('calculates the percent change', () => {
   const change =  formatData.calculatePercentChange(0, 0)
   expect(change).toBe('NaN')
})

it('calculates the percent change', () => {
    const change =  formatData.calculatePercentChange(1000, 500)
    expect(change).toBe("100.00")
})

it('calculates the percent change', () => {
    const change =  formatData.calculatePercentChange(500, 1000)
    expect(change).toBe("-50.00")
})

it('calculates the percent change', () => {
    const change =  formatData.calculatePercentChange(1237.54, 1024.79)
    expect(change).toBe("20.76")
})

it('calculates the percent change', () => {
    const change =  formatData.calculatePercentChange(1024.79, 1237.54)
    expect(change).toBe("-17.19")
})

it('calculates the percent change', () => {
    const change =  formatData.calculatePercentChange(123705.54, 20.45)
    expect(change).toBe("604817.07")
})

it('calculates the percent change', () => {
    const change =  formatData.calculatePercentChange(20.45, 123705.54)
    expect(change).toBe("-99.98")
})

it('calculates the percent change', () => {
    const change =  formatData.calculatePercentChange(0, 100.34)
    expect(change).toBe("-100.00")
})

/*const calculated = transactions.map(t => {
    const profitLossUnf = (t.price - t.initial_price) * t.asset_amount;
    const holdings = (t.asset_amount * t.price);
    const initialHoldings = (t.asset_amount * t.initial_price);

*/
describe('Profit/Loss/Holdings tests', () => {
    const transactions1 = [
        {
            "price": 1500,
            "initial_price": 1000,
            "asset_amount": 3
        },
        {
            "price": 0.000000234,
            "initial_price": 0.000000221,
            "asset_amount": 12500
        },
        {
            "price": 2356.54,
            "initial_price": 8974.32,
            "asset_amount": 50
        },
        {
            "price": 0,
            "initial_price": 500.535802,
            "asset_amount": 23
        },
        {
            "price": 32454.284935687,
            "initial_price": 17567.8239652873,
            "asset_amount": 9
        }
    ]


    it('calculates profit/loss, holdings', () => {
        const calculated = formatData.calculateProfitLossHoldings(transactions1)
        expect(calculated).toMatchObject([{
            "price": 1500,
            "initial_price": 1000,
            "asset_amount": 3,
            "profitLossUnf": 1500,
            "holdings": 4500,
            "initialHoldings": 3000
        },
        {
            "price": 0.000000234,
            "initial_price": 0.000000221,
            "asset_amount": 12500,
            "profitLossUnf": 0.00016249999999999997,
            "holdings": 0.002925,
            "initialHoldings": 0.0027625
        },
        {
            "price": 2356.54,
            "initial_price": 8974.32,
            "asset_amount": 50,
            "profitLossUnf": -330889,
            "holdings": 117827,
            "initialHoldings": 448716
        },
        {
            "price": 0,
            "initial_price": 500.535802,
            "asset_amount": 23,
            "profitLossUnf": -11512.323446,
            "holdings": 0,
            "initialHoldings": 11512.323446
        },
        {
            "price": 32454.284935687,
            "initial_price": 17567.8239652873,
            "asset_amount": 9,
            "profitLossUnf": 133978.14873359728,
            "holdings": 292088.56442118296,
            "initialHoldings": 158110.41568758572
        }
    ])
    })
})




