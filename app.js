var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
var cheerio = require('cheerio');
var _ = require('underscore');
var keywordExtractor = require("keyword-extractor");

var app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT || '3000', function () {
  console.log('Server started on port: ' + this.address().port);
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//console.log(extractKeywords("Went out for lunch with my babes. Was rlly fun"));

getKeywords("http://shivamhacks.github.io/");


function getKeywords(url) {
  request({
    uri: url,
  }, function(error, response, html) {
    var $ = cheerio.load(html);
    var keywords = [];
    getAllTxtEls($, keywords);
    var formatted = _.uniq([].concat.apply([], keywords));
    console.log(formatted);
  });
}

function getAllTxtEls($, arr) {
  getElKeys($, arr, 'p');
  getElKeys($, arr, 'h1');
  getElKeys($, arr, 'h2');
  getElKeys($, arr, 'h3');
  getElKeys($, arr, 'h4');
  getElKeys($, arr, 'h5');
  getElKeys($, arr, 'h6');
  getElKeys($, arr, 'span');
  getElKeys($, arr, 'a');
}

function getElKeys($, arr, el) {
  $(el).each( function(i, element) {
    var txt = $(this).text();
    arr.push(extractKeywords(txt));
  });
}

function extractKeywords(phrase) {
  return keywordExtractor.extract(phrase, {
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: true
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send("ERROR");
});


module.exports = app;
