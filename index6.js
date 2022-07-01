const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//Reading the html file outside since could read only once at the start
const tempOverview = fs.readFileSync(`${__dirname}/template/template-overview.html` , 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/template/template-product.html` , 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/template/template-card.html` , 'utf-8');

// Reading the json from the data.json
const data = fs.readFileSync(`${__dirname}/node-farm/data.json`);
const dataObj = JSON.parse(data);

const slugs  = dataObj.map(el => slugify(el.productName , {lower : true}));
console.log(slugs);

//Creating the server
const server = http.createServer((req , res)=>{
    const {query , pathname} = url.parse(req.url , true);

    if(pathname === '/' || pathname === '/overview')
    {
        res.writeHead(200 , {'content-type'  : 'text/html'});
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard , el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}' , cardHtml);
        res.end(output);
    }
    else if(pathname === '/product'){
        res.writeHead(200 , {'content-type'  : 'text/html'});
        const product = dataObj[query.id];
        const output =  replaceTemplate(tempProduct , product);
        res.end(output);
    }
    else if(pathname === '/Api'){
        res.writeHead(200 , {
            'content-type' : 'application/json'
        });
        res.end(data);
    }
    else{
        res.writeHead(404 , {
            'content-type' : 'text/html',
            'my-own-head' : 'hello world'
        })
        res.end('Page not found');
    }
})

server.listen(8000 , '127.0.0.1',()=>{
    console.log('Your response is ready for port 8000');
})