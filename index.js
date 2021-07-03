const express = require('express')
const cors  = require('cors')
const bodyParser = require('body-parser')
const { MongoClient, ObjectID } = require('mongodb');
const app = express()

require('dotenv').config()
// console.log(process.env.DB_USER)

app.use(cors())
app.use(bodyParser.json())


const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jayfm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  console.log(err)
  const eventCollection = client.db("volunteer").collection("event");

  app.get('/events', (req, res) =>{

    eventCollection.find()
    .toArray( (err, items) => {
      res.send(items)
    })
  })




  app.post('/addEvent', (req,res) => {
    const newEvent = req.body;
    console.log('adding event', newEvent)
    eventCollection.insertOne(newEvent)
    .then(result => {
      console.log('instred count', result)
      res.send(result.insertedCount > 0)
    })
  })

// app.delete('/eventsDelete/:id'), (req, res =>{
//   const id = ObjectID(req.params.id)
//   console.log('delete', id);
//   eventCollection.findOneAndDelete({_id: id})
//   .then(document => res.send(!!document.value))
// })



});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})      