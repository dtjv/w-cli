export const css = `
html,
body,
h1,
h2,
h3,
h4,
h5,
h6,
ul,
li {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
body {
  font-family: 'menlo';
  line-height: 1;
  color: #555;
}
ul {
  list-style: none;
  padding-top: 0.25rem;
}
.container {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.workout {
  width: 12rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
}
.workout h1,
.workout h2,
.workout h3 {
  font-weight: 700;
}
.workout h1 {
  font-size: 1.5rem;
}
.workout h2 {
  margin-top: 1rem;
  padding: 0.25rem;
  background-color: #ddd;
}
.workout h3,
.workout h2:first-child {
  margin-top: 0.5rem;
}
`.replaceAll(/[\n]/g, '')
