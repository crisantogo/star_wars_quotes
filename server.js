//server.js
console.log('May Node be with you')
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const bodyParser=require('body-parser')
const app = express()
const MongoClient= require('mongodb').MongoClient
const connectionString= process.env.MONGODB
MongoClient.connect(connectionString, {useUnifiedTopology:true})
    .then(client=>{
        console.log('Connected to Database')
        const db=client.db('star-wars-quotes')
        const quotesCollection=db.collection('quotes')
        // Make sure you place body-parser before your CRUD handlers!
        // Middlewares
        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({extended:true}))
        // We normally abbreviate `request` to `req` and `response` to `res`.
        // app.get('/', function(req,res){
            //     res.send('Hello World')
            // })
        app.use(bodyParser.json())
        app.use(express.static('public'))    
        //Routes    
        app.get('/', (req,res)=>{
            //res.sendFile(__dirname + '/index.html')
            db.collection('quotes').find().toArray()
            .then(results =>{
                res.render('index.ejs', { quotes: results})
            })
            .catch(error => console.error(error))
            
        })
        app.post('/quotes',(req,res)=>{
            quotesCollection.insertOne(req.body)
            .then(result=>{
                console.log(result)
                res.redirect('/')
            })
            .catch(error=>console.error(error))
        })

        app.put('/quotes', (req, res)=>{
            quotesCollection.findOneAndUpdate(
                {name: 'Yoda'},
                {
                    $set:{
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => {
                res.json('Success')
            })
            .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res)=>{
            quotesCollection.deleteOne(
                {name: req.body.name}
            )
            .then(result=>{
                if(result.deletedCount===0){
                    return res.json('No quote to delete')
                }
                res.json(`Deleted Darth Vader's quote`)
            })
            .catch(error=>console.error(error))
        })

    })
    .catch(error=> console.error(error))
        
    
app.listen(3000, function(){
            console.log('listening on 3000')
        })