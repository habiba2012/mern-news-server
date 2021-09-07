const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Welcome to Blog Server');
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@database.1n8y8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const blogCollection = client.db(`${process.env.DB_NAME}`).collection("blogs");
    const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
    const adminsCollection = client.db(`${process.env.DB_NAME}`).collection("admins");

    app.get('/blogs', (req, res) => {
        blogCollection.find({})
            .toArray((err, docs) => res.send(docs))
    })

    app.get('/reviews', (req, res) => {
        if (req.query.email) {
            return reviewCollection.find({ email: req.query.email })
                .toArray((err, docs) => res.send(docs[0]))
        }
        reviewCollection.find({})
            .toArray((err, docs) => res.send(docs))
    })



    app.get('/isAdmin', (req, res) => {
        adminsCollection.find({ email: req.query.email })
            .toArray((err, docs) => res.send(!!docs.length))
    })

    app.post('/addBlog', (req, res) => {
        serviceCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedCount))
    })

    app.post('/addReview', (req, res) => {
        reviewCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedCount))
    })

    app.post('/addAdmin', (req, res) => {
        adminsCollection.insertOne(req.body)
            .then(result => res.send(!!result.insertedCount))
    })



    app.patch('/updateOrderStatus', (req, res) => {
        const { id, status } = req.body;
        console.log(req.body);
        orderCollection.findOneAndUpdate(
            { _id: ObjectId(id) },
            {
                $set: { status },
            }
        ).then(result => res.send(result.lastErrorObject.updatedExisting))
    })

    app.patch('/update/:id', (req, res) => {
        serviceCollection.updateOne(
            { _id: ObjectId(req.params.id) },
            {
                $set: req.body
            }
        ).then(result => res.send(!!result.modifiedCount))
    })

    app.delete('/delete/:id', (req, res) => {
        serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => res.send(!!result.deletedCount))
    })

    app.patch('/updateReview/:id', (req, res) => {
        reviewCollection.updateOne(
            { _id: ObjectId(req.params.id) },
            {
                $set: req.body
            }
        ).then(result => res.send(!!result.modifiedCount))
    })

    app.delete('/deleteReview/:id', (req, res) => {
        reviewCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => res.send(!!result.deletedCount))
    })
});

app.listen(port);