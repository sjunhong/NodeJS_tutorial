module.exports= {
    html:function (title, list, body, control){
      return `<!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head> 
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
      </body>
      </html>
      `
    }, list:function(fileList){
      var i = 0;
      var list = '<ul>';
      while(i < fileList.length){
        list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
        i += 1; 
      }
      list = list + '</ul>';
      return list;
    }
  }

