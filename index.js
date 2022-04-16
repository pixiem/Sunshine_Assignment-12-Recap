
const express = require("express");
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
const fileUpload = require('express-fileupload')



app.use(cors());
app.use(express.json());
app.use(fileUpload())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f6666.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log('hitting database')
      const addProduct = client.db('allCycle');
      const addProductList = addProduct.collection('all_Cycles_list');
      const orderData = client.db('allORder');
      const allORderDAta = orderData.collection('allOrderList');
      const reviews = client.db('allreview');
      const allReviews = reviews.collection('allreviewlist');
    
      

      app.post("/addCycle", async (req, res) => {

        const user = req.body;
        console.log(req.body)
        const cycleName = user.name;
        const cycleDes = user.description;
        const cyclePrice = user.price;
        const cycleImg = user.image;

        const product = {
          cycleName:cycleName,
          cycleDes:cycleDes,
          cyclePrice:cyclePrice,
          cycleImg:cycleImg 
          }
          console.log(product)
        const result = await addProductList.insertOne(product);
        res.json(result);
       
    });        
    app.get('/getCycle',async (req,res)=>{
      const cursor = addProductList.find({});
      const drone = await cursor.toArray();
      res.send(drone);      
    })
    app.get('/placeorder/:id', async (req, res) =>  {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const place = await addProductList.findOne(query);
      res.json(place);

   })
   app.post("/addOrder", async (req, res) => {
    const user = req.body;
    const result = await allReviews.insertOne(user);
    res.json(result);
});    
   app.post("/reviewadd", async (req, res) => {
    const user = req.body;
    const result = await allReviews.insertOne(user);
    res.json(result);
});    
   app.get("/allreview", async (req, res) => {
  
    const result = await allReviews.find({}).toArray();
    res.send(result);
});    
 
  app.get('/myorder/:email', async (req, res) => {
    const email = req.params.email;

    const result = await allORderDAta.find({ email: email }).toArray();
    res.send(result);
    
});
  app.get('/allorder', async (req, res) => {
    const cursor = allORderDAta.find({});
    const result = await cursor.toArray();
    
    res.send(result);
    
});

app.delete("/deletemyorder/:id", async (req, res) => {
  const id = req.params.id ;
  const query = {_id:ObjectId(id)}
  const result = await allORderDAta.deleteOne(query);
  console.log(result);
  res.json(result);
});
app.delete("/admindeleteorder/:id", async (req, res) => {
  const id = req.params.id ;
  const query = {_id:ObjectId(id)}
  const result = await allORderDAta.deleteOne(query);
  console.log(result);
  res.json(result);
});

  
  
    }
    finally {
     
  
    }
  
  }
  run().catch(console.dir);
  
  
app.get('/',(req,res)=>{
    res.send('WELCOME TO CYCLE SERVER')
})
app.listen(port,()=>{
    console.log('running server')
})