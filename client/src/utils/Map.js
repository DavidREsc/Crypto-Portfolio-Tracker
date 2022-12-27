class Node {
    constructor(val = null) {
        this.val = val
        this.next = null
    }
}

class Queue {
    constructor() {
        this.start = null
        this.end = null
        this.length = 0
    }

    enqueue(val) {
        let node = new Node(val)
        if (!this.end) {
            this.end = node
            this.start = this.end
        }
        else {
            this.end.next = node
            this.end = this.end.next
        }
        this.length++
    }

    dequeue() {
        let node = this.start
        if (!node) return null
        this.start = this.start.next
        if (node === this.end) this.end = null
        this.length--
        return node
    }

    next() {
        return this.next
    }

    update(val) {
        let node = new Node(val)
        if (this.length === 1) {
            this.end = node
            this.start = this.end
        }
        else {
            node.next = this.start.next
            this.start = node
        }
    }

    peek() {
        return !this.start ? null : this.start.val
    }

    print() {
        let node = this.start
        while (node) {
            console.log(node.val)
            node = node.next
        }
    }
}

class Map {
    constructor() {
        this.map = {}
    }

    set(key, val) {
        if (!this.map[key]) {
            let queue = new Queue()
            queue.enqueue(val)
            this.map[key] = queue
        }
        else {
            this.map[key].enqueue(val)
        }
    }

    sell(key, val) {
        // No buy transaction for this asset, sell transaction is entirely profit
        if (!this.map[key]) return val.price * val.amount
        // Get earliest transaction value
        let originalVal = this.map[key].peek()
        // No more buy transactions left, sell transaction is entirely profit
        if (!originalVal) return  val.price * val.amount
        let newVal = {}
        let profit = 0
        while (originalVal) {
            if (originalVal.t.transaction_date > val.date) {
                break;
            }
            // if sell transaction amount is larger than the buy transaction amount
            else if (val.amount > originalVal.amount) {
                // subtract buy amount from sell amount
                val.amount -= originalVal.amount
                originalVal.t.amount_sold = originalVal.t.asset_amount
                // remove earliest buy transaction from queue
                this.map[key].dequeue()
                // calculate profit
                profit += (val.price - originalVal.price) * originalVal.amount
                // get next earliest buy transaction
                originalVal = this.map[key].peek()
            }
            else {
                newVal.amount = originalVal.amount - val.amount
                originalVal.t.amount_sold = val.amount + (originalVal.t.amount_sold || 0)
                newVal.price = originalVal.price
                newVal.t = originalVal.t
                profit += (val.price - originalVal.price) * val.amount
                val.amount = 0
                if (newVal.amount) this.map[key].update(newVal)
                else this.map[key].dequeue()
                break;
            } 
        }
        if (val.amount) profit += val.price * val.amount
        return profit
    }

    print(key) {
        if (!this.map[key]) return
        this.map[key].print()
    }
}

export default Map