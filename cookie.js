const http = require('http');
const cookie = require('cookie');

let app = http.createServer((request, response) => {
  if (request.headers.cookie !== undefined) {
    let cookies = cookie.parse(request.headers.cookie);
    console.log(cookies);
  }
  response.writeHead(200, {
    'Set-Cookie': [
      'tasty_cookie=strawberry',
      'yummy_cookie=choco',
      `Permanent=cookies; Max-age=${60 * 60 * 24 * 30}`,
      'Secure=Secure; Secure',
      'HttpOnly=HttpOnly; HttpOnly',
      'Path=Path; Path=/cookie',
      'Domain=Domain; Domain=o2.org',
    ],
  });
  response.end('Cookie!');
});

app.listen(3000);
