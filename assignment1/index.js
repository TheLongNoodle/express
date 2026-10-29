import http from 'http';
import { URL } from 'url';

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

const server = http.createServer(function (req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`).pathname;
  const method = req.method;

  res.setHeader('Content-Type', 'application/json');

  if (method === 'POST' && url === '/api/numbers/prime/validate') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const body = JSON.parse(body);

        if (body && Array.isArray(body.numbers)) {
          const result = isArrayPrime(body.numbers);
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } else {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid body' }));
        }
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  if (method === 'GET' && url === '/api/numbers/prime') {
    const amountStr = url.searchParams.get('amount');
    const amount = parseInt(amountStr, 10);

    if (isNaN(amount) || amount < 1 || amount > 32) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Amount must be a number between 1 and 32' }));
      return;
    }

    const primes = [];
    let current = 2;
    while (primes.length < amount) {
      if (isPrime(current)) {
        primes.push(current);
      }
      current++;
    }

    res.writeHead(200);
    res.end(JSON.stringify(primes));
    return;
  }

      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(3000, function () {
  console.log('Server start at port 3000');
});