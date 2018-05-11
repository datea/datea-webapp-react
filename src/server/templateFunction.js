
export default (html, helmet) => `
  <!doctype html>
  <html ${helmet.htmlAttributes.toString()}>
  <head>
    <meta charset="utf-8">
  	<meta http-equiv="X-UA-Compatible" content="IE=edge">
  	<meta name="viewport" content="width=device-width">

  	<!-- META TAGS -->
  	${helmet.title.toString()}
  	${helmet.meta.toString()}
    ${helmet.link.toString()}
  </head>
  <body>
  	<div id="pageMain">${html}</div>
  </body>
  </html>
`
