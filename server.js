'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const validator = require('validator');
const normalizer = require('normalize-url');
const alphaInc = require('./utils/alphanumeric-increment');

/* SCHEMA
{
  shortcut: 'short',
  url: 'http://path-to-url.com'
}
*/
const db = require('monk')(`${process.env.MONGOLAB_URI || 'localhost'}/urls`);
const urls = db.get('urls');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(path.resolve(__dirname, 'client')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/:short', (req, res) => {
  const short = req.params.short;
  urls.findOne({shortcut: {$eq: short}})
    .success(doc => {
      if (doc) {
        res.redirect(doc.url);
      } else {
        res.json({error: 'no record found'});
      }
    })
    .error(() => res.json({error: 'no record found'}));
});

app.get(/^\/set\/(.+)/, (req, res) => {
  const url = req.params[0];
  // return early if URL is invalid
  if (!validator.isURL(url)) {
    res.json({error: 'invalid URL'});
    return;
  }

  const normal = normalizer(url);

  // If this url has already been shortened, return that
  urls.find({url: {$eq: normal}})
    .success(doc => {
      if (doc.length !== 0) {
        doc = doc[0];
        res.json({
          shortURL: `${req.protocol}://${req.get('host')}/${doc.shortcut}`
        });
      } else {
        // if valid and not found, make a new shortcut url and return
        urls.find({}, {sort: {_id: -1}, limit: 1})
          .success(doc => {
            let nextNum;
            if (!doc || doc.length < 1) {
              nextNum = '0';
            } else {
              doc = doc[0];
              nextNum = alphaInc.next('' + doc.shortcut);
            }

            // insert record and return short url
            urls.insert({shortcut: nextNum, url: normal})
              .success(doc => {
                res.json({
                  shortURL:
                    `${req.protocol}://${req.get('host')}/${doc.shortcut}`
                });
              })
              .error(err => {
                res.json({error: err});
              });
          });
      }
    });
});

app.listen(app.get('port'), () => {
  console.log(`server listening on port ${app.get('port')}`);
});
