const mongoose = require('mongoose');
var uri = 'mongodb://<user>:<password>@<URL>'
const request = require('request');
const cheerio = require('cheerio');


mongoose.connect(uri, { useNewUrlParser: true}, (err, database) => {
    if(err){
        console.log(err);
    }else{
        console.log('Connection Opened');
        request('https://www.brainyquote.com/topics/motivational', 
        (error, response, html) => {
            if(!error && response.statusCode == 200){
                const $ = cheerio.load(html);
                var quoteText = null;
                var quoteAuthor = null;
                var counter = 0;
                $('#quotesList .clearfix a').each((i, el) => {
                    if(el.attribs.class != 'oncl_q') {
                        const classAttribute = el.attribs.class;
                        if(classAttribute.indexOf('b-qt') >= 0) {
                            quoteText = $(el).text();
                        } else if(classAttribute.indexOf('bq-aut') >= 0){
                            quoteAuthor = $(el).text();
                            const quote = {
                                quote: quoteText,
                                author: quoteAuthor
                            }
                            database.collection('motivational_quotes').insertOne(quote, (err, res) => {
                                if(err){
                                    console.log(error);
                                }else{
                                    console.log('Record inserted! ID: ' + res.ops[0]._id + quote);
                                    counter = counter + 1;
                                }
                            });
                        }
                    }
                });
                mongoose.connection.close();
                console.log('Connection Closed');
            }
            else{
                console.log(error);
                mongoose.connection.close();
                console.log('Connection Closed due to error with Scraping!');
            }
        });
    }
});
