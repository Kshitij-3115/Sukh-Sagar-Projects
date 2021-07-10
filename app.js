const express = require('express');
const router = require('./routers.js'); 

//init app
const app = express();
const port = 8000;

//set up views --> 
app.set('view engine', 'pug'); 
//serve static assets --> 
app.use(express.static('./public'));

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/signup', (req, res) => {
    res.render('signup');
})


app.use('/form',router); 


app.use('/user',router);
//start server -> 
app.listen(port, () => {
    console.log("server is up on port number 8000"); //server started! 
})