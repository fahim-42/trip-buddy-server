const express = require('express');
const app = express();
const port = process.env.PORT || 3050;

require('dotenv').config();

const cors = require('cors');
app.use(cors());
app.use(express.json());

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p55ig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('TripBuddy');
        
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('orders');

        // GET API => Service.js
        app.get('/services', async (req, res) => {
            const allServices = serviceCollection.find({});
            const services = await allServices.toArray();
            res.send(services);
        })
         // GET API => All Orders
        app.get('/orders', async (req, res) => {
            const allOrders = orderCollection.find({});
            const orders = await allOrders.toArray();
            res.send(orders);
        })

        // POST API => PlaceOrder.js
        app.post('/orders', async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('TripBuddy Server is running');
})
app.listen(port, () => {
    console.log('Server running at:', port);
})