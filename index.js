const express = require('express');
const app = express();

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// accept request bodies as URL encoded query strings or JSON
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('port', 7531);

// for getting data from APIs
const googleTrends = require('google-trends-api');
const axios = require('axios');

// GET request for more data from Google Trends
app.get('/emunch/more', (req, res) => {
  googleTrends.interestByRegion({keyword: 'Edvard Munch'})
  .then((results) => {
    res.send(results)
  });
});

/* Routes for different pages of website */
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/emunch', (req, res) => {
  googleTrends.relatedTopics({keyword: 'Edvard Munch'})
  .then((results) => {
    var relatedTopics = JSON.parse(results);
    var search = relatedTopics.default.rankedList[0].rankedKeyword;
    res.render('emunch', {
      search
    });
  });
});

// method of using axios to make multiple concurrent requests from
// https://www.twilio.com/blog/2017/08/http-requests-in-node-js.html
// and axios README
app.get('/vangogh', (req, res) => {
  axios.all([
    axios.get("https://collectionapi.metmuseum.org/public/collection/v1/objects/436535"),
    axios.get("https://collectionapi.metmuseum.org/public/collection/v1/objects/436536"),
    axios.get("https://collectionapi.metmuseum.org/public/collection/v1/objects/336327"),
    axios.get("https://collectionapi.metmuseum.org/public/collection/v1/objects/436526")
  ])
  .then((results) => {
    res.render("vangogh", {
      pic1: results[0].data,
      pic2: results[1].data,
      pic3: results[2].data,
      pic4: results[3].data
    })
  });
});

app.get('/sources', (req, res) => {
  res.render("sources")
});

// render 404 page 
app.use((req, res) => {
  res.type('html');
  res.status(404);
  res.render('404');
});

// render 500 page 
app.use((req, res) => {
  res.type('html');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log(`Express started on http://${process.env.HOSTNAME}:${app.get('port')}; press Ctrl-C to terminate.`);
});