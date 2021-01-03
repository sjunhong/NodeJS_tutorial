module.exports = {
  html: function (
    title,
    list,
    body,
    control,
    authStatusUI = `<a href="/login">login</a>`
  ) {
    return `<!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head> 
      <body>
        ${authStatusUI}
        ${list}
        ${control}
        ${body}
      </body>
      </html>
      `;
  },
  list: function (fileList) {
    var i = 0;
    var list = '<ul>';
    while (i < fileList.length) {
      list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
      i += 1;
    }
    list = list + '</ul>';
    return list;
  },
};
