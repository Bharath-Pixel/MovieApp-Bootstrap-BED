//Name: Sundar Bharath
//Admin Number: 2224178
//Class: DIT/FT/1B/01


const app = require('./controller/app.js');
var serveStatic = require('serve-static');
const PORT = 8081;

app.use(serveStatic(__dirname + '/public')); 

app.listen(PORT, () => {
    console.log('Web App Hosted at http://localhost:%s',PORT);
});