var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
const { timeLog } = require('console');
let cookie = require('cookie');

let authIsOwner = (request, response) => {
  let isOwner = false;
  let cookies = {};
  if (request.headers.cookie) {
    cookies = cookie.parse(request.headers.cookie);
  }
  if (cookies.email === 'tank6138@gmail.com' && cookies.password === '111111') {
    isOwner = true;
  }
  return isOwner;
};

let authStatusUI = (request, response) => {
  let authStatusUI = `<a href="/login">login</a>`;
  if (authIsOwner(request, response)) {
    authStatusUI = `<a href="/logout_process">Logout</a>`;
  }
  return authStatusUI;
};

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathName = url.parse(_url, true).pathname;

  if (pathName === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (err, fileList) {
        var title = 'Welcome!';
        var description = 'JS code';
        var list = template.list(fileList);
        var html = template.html(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`,
          authStatusUI(request, response)
        );
        response.writeHead(200);
        response.end(html);
      });
    } else {
      fs.readdir('./data', function (err, fileList) {
        var list = template.list(fileList);
        var filteredData = path.parse(queryData.id).base;
        fs.readFile(
          `data/${filteredData}`,
          'utf8',
          function (err, description) {
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags: ['h1'],
            });
            var html = template.html(
              title,
              list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              `<a href="/create">create</a> 
            <a href="/update?id=${sanitizedTitle}">update</a> 
            <form action="/delete_process" method="POST">
              <input type="hidden" name="id" value="${sanitizedTitle}"> 
              <input type="submit" value="delete">
            </form>`,
              authStatusUI(request, response)
            );
            response.writeHead(200);
            response.end(html);
          }
        );
      });
    }
  } else if (pathName === '/create') {
    if (authIsOwner(request, response) === false) {
      response.end('Login required!');
      return false;
    }
    fs.readdir('./data', function (err, fileList) {
      var title = 'Web - create';
      var list = template.list(fileList);
      var html = template.html(
        title,
        list,
        `
      <form action="/create_process" method="POST">
        <p>
            <input type="text" name="title" placeholder="title">
        </p>
        <p>
            <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
            <input type="submit">
        </p>
      </form> 
      `,
        '',
        authStatusUI(request, response)
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathName === '/create_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      var filteredId = path.parse(title).base;
      fs.writeFile(`data/${filteredId}`, description, 'utf8', function () {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (pathName === '/update') {
    if (authIsOwner(request, response) === false) {
      response.end('Login required!');
      return false;
    }
    fs.readdir('./data', function (err, fileList) {
      var list = template.list(fileList);
      var filteredData = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredData}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var html = template.html(
          title,
          list,
          `
          <form action="/update_process" method="POST">
          <input type="hidden" name="id" value="${title}">
            <p>
                <input type="text" name="title" value="${title}">
            </p>
            <p>
                <textarea name="description" placeholder="description">${description}</textarea>
            </p>
            <p>
                <input type="submit">
            </p>
          </form>   
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`,
          authStatusUI(request, response)
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathName === '/update_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function (error) {});
      console.log(post);
      fs.writeFile(`data/${title}`, description, 'utf8', function () {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (pathName === '/delete_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function (err) {});
      response.writeHead(302, { Location: `/` });
      response.end();
    });
  } else if (pathName == '/login') {
    fs.readdir('./data', function (err, fileList) {
      var title = 'Welcome!';
      var list = template.list(fileList);
      var html = template.html(
        title,
        list,
        `<form action="login_process" method= "POST"
        <p><input type="text" name="email" placeholder="email"</p>
        <p><input type="password" name="password" placeholder="password"</p>
        <p><input type="submit"</p>
      </form>
      `,
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathName === '/login_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      if (post.email === 'tank6138@gmail.com' && post.password === '111111') {
        response.writeHead(302, {
          'Set-Cookie': [
            `email=${post.email}`,
            `password=${post.password}`,
            `nickname=Jun`,
          ],
          Location: `/`,
        });
        response.end();
      } else {
        response.end('Who?');
      }
    });
  } else if (pathName === '/logout_process') {
    var body = '';
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      response.writeHead(302, {
        'Set-Cookie': [
          `email=; Max-age=0`,
          `password=; Max-age=0`,
          `nickname=; Max-age=0`,
        ],
        Location: `/`,
      });
      response.end();
    });
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
});

app.listen(3000);
