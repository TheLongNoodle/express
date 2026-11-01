import express from "express";

const app = express();
app.use(express.json());
app.set('view engine', 'ejs'); 
const PORT = 3000;

function isPrime(number) {
    let start = 2;
    const limit = Math.sqrt(number);
    while (start <= limit) {
        if (number % start++ < 1) return false;
    }
    return number > 1;
}

function isArrayPrime(array) {
    for (const number of array) {
        if (!isPrime(number)) return false;
    }
    return true;
}

function returnPrimeArray(amount) {
    const primes = [];
    let current = 2;
    while (primes.length < amount) {
        if (isPrime(current)) {
            primes.push(current);
        }
        current++;
    }
    return primes;
}

app.post("/api/numbers/prime/validate", (req, res) => {
    const body = req.body;
    console.log(`Incoming request\nquery: ${JSON.stringify(body)}`);

    if (body && Array.isArray(body.numbers)) {
        const result = isArrayPrime(body.numbers);
        res.send(JSON.stringify(result));
        console.log(`Output: ${JSON.stringify(result)}`);
        return;
    }
    res.status(400).json({ error: "bad body payload" });
});

app.get("/api/numbers/prime", (req, res) => {
    const query = req.query.amount;
    console.log(`Incoming request\nquery: ${JSON.stringify(query)}`);
    const amount = parseInt(query, 10);

    if (isNaN(amount) || amount < 1 || amount > 32) {
        res.status(400).json({ error: "Amount must be a number between 1 and 32" });
        return;
    }
    primes = returnPrimeArray(amount);
    res.send(JSON.stringify(primes));
    console.log(`Output: ${JSON.stringify(primes)}`);
});

app.get("/api/numbers/prime/display", (req, res) => {
    res.render("display", {
        primes: returnPrimeArray(10),
    });
});

app.all("*any", (req, res) => {
    res.status(404).json({
        status: "fail",
        message: `Cannot find ${req.method} on endpoint ${req.originalUrl}`,
    });
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
