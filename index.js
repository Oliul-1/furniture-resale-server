const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

// 
// 




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.onwvwl4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}






async function run() {
    try {
        const productsCategoryCollection = client.db('furniturePortal').collection('ProductsCategory');
        const categoryDataCollection = client.db('furniturePortal').collection('categoryData');
        const usersCollection = client.db('furniturePortal').collection('user');


        const verifyAdmin = async (req, res, next) => {
            const adminEmail = req.decoded.email;
            const query = { email: adminEmail };
            const user = await usersCollection.findOne(query);

            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        }


        

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



        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

    }
    finally {

    }
}

run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('furniture portal is running')
});

app.listen(port, () => console.log('furniture portal is running', port))