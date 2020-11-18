var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, description){
  return `<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head> 
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <h2>${title}</h2>
    <p>${description}
    </p>
  </body>
  </html>
  `
}

function templateList(fileList){
  var i = 0;
  var list = '<ul>';
  while(i < fileList.length){
    list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
    i += 1; 
  }
  list = list + '</ul>';
  return list;
}


var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathName = url.parse(_url, true).pathname;
  
  if(pathName === '/'){
    
    if(queryData.id === undefined){

      fs.readdir('./data', function(err, fileList){
        var title = 'Welcome!';
        var description = 'JS code';
        var list = templateList(fileList);
        var template = templateHTML(title, list, description);
        response.writeHead(200);
        response.end(template);
      });
      
      
    }
    else {
      fs.readdir('./data', function(err, fileList){
        var list = templateList(fileList);
        fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
          var title = queryData.id;
          var template = templateHTML(title, list, description);
          response.writeHead(200);
          response.end(template);
        });
      });
    } 
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
});


app.listen(3000);