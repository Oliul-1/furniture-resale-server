const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

// furniture
// uQbXreAfpomZrj9w




const uri = "mongodb+srv://furniture:uQbXreAfpomZrj9w@cluster0.onwvwl4.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productsCategoryCollection = client.db('furniturePortal').collection('ProductsCategory');
        const categoryDataCollection = client.db('furniturePortal').collection('categoryData');

        app.get('/category', async (req, res) => {
            const data = req.query.data;
            const query = {};
            const categores = await productsCategoryCollection.find(query).toArray();
            res.send(categores)
        })

        app.get('/products', async (req, res) => {
            const data = req.query.data;
            const query = {};
            const products = await categoryDataCollection.find(query).toArray();

            res.send(products)
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: Object(id) };
            const product = await categoryDataCollection.findOne(query);
            res.send(product);
        })
    }
    finally {

    }
}

run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('furniture portal is running')
});

app.listen(port, () => console.log('furniture portal is running', port))