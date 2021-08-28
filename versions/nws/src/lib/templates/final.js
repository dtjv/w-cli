export default `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!-- This file may get emailed, so it cannot have external dependencies. -->
  <style type="text/css" media="screen, print">
  /*
    http://meyerweb.com/eric/tools/css/reset/
    v2.0 | 20110126
    License: none (public domain)
  */
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  @page:left {
    margin-top: .5in;
  }
  @page:right {
    margin-top: .5in;
  }
  body {
    font-family: "Inconsolata", monospace;
    font-weight: 400;
    font-size: .75em;
  }
  .container {
    padding: 5px;
  }
  .container h1,
  .container h2,
  .container h3 {
    font-weight: 700;
  }
  .container h1 {
    font-size: 1.5em;
  }
  .container h2 {
    padding-top: 20px;
  }
  .container h2:first-child {
    padding-top: 5px;
  }
  .container h3 {
    font-weight: 700;
    padding-top: 5px;
  }
  .container li {
    margin-top: 2px;
    margin-right: 0px;
    margin-bottom: 2px;
    margin-left: 10px;
  }
  @media print {
    .container {
      border: none;
    }
  }
  .workout {
    width: 200px;
    margin: 5px;
    padding: 5px;
    display: inline-block;
    vertical-align: top;
    border: 1px solid black;
  }
  </style>
</head>
<body>
  <article class="container">
  $body$
  </article>
</body>
</html>`;
