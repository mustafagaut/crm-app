const http = require('http');
const app = require('./src/app');

const server = http.createServer(app);

server.listen(5011, async () => {
  const payload = JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });

  const signupResponse = await fetch('http://127.0.0.1:5011/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload
  });

  const signupBody = await signupResponse.text();
  console.log('signup', signupResponse.status, signupBody);

  const loginResponse = await fetch('http://127.0.0.1:5011/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload
  });

  const loginBody = await loginResponse.text();
  console.log('login', loginResponse.status, loginBody);

  server.close();
});
