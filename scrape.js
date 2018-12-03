const request = require('request');
const cheerio = require('cheerio');

request('https://www.brainyquote.com/topics/motivational', 
(error, response, html) => {
    if(!error && response.statusCode == 200){
        const $ = cheerio.load(html);
        var quoteText = null;
        var quoteAuthor = null;
        $('#quotesList .clearfix a').each((i, el) => {
            if(el.attribs.class != 'oncl_q') {
                const classAttribute = el.attribs.class;
                if(classAttribute.indexOf('b-qt') >= 0) {
                    quoteText = $(el).text();
                    //console.log("Quote: " + quoteText);
                } else if(classAttribute.indexOf('bq-aut') >= 0){
                    quoteAuthor = $(el).text();
                    const item = {
                        quote: quoteText,
                        author: quoteAuthor
                    }
                    console.log(item);
                }
            }
        });
    }
    else{
        console.log(error);
    }
});
