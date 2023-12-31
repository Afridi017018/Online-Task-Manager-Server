const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x606k.mongodb.net/brand-shop?retryWrites=true&w=majority`;



const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const dbConnect = async () => {
    try {
        await client.connect();
        console.log("Database Connected!");
    } catch (error) {
        console.log(error.name, error.message);
    }
};
dbConnect();


app.get("/", (req, res) => {
    res.send("Hello World")
})




// Connect the client to the server	(optional starting in v4.7)
// await client.connect();
// Send a ping to confirm a successful connection
const taskCollection = client.db("task-manager").collection("tasks");
// const cartCollection = client.db("brand-shop").collection("cart");

app.post('/add-task', async (req, res) => {

    const newTask = req.body;

    // console.log(newTask)
    const result = await taskCollection.insertOne({ ...newTask });
    res.json({ result });

})


app.get('/get-tasks/:email', async (req, res) => {
    
    const {email} = req.params;
    const result = await taskCollection.find({email}).toArray();
    // console.log(result)
    res.json({ result });

})

app.put('/update-task-status', async (req, res) => {
    const { id, status } = req.body;

    const query = { _id: new ObjectId(id) }
    const update = {
        $set: {
            status
        },
    };

    const result = await taskCollection.findOneAndUpdate(query, update);

    res.json({ result });

})

app.delete('/delete-task/:id', async (req, res) => {

    const { id } = req.params;

    const query = { _id: new ObjectId(id) }


    const result = await taskCollection.findOneAndDelete(query);

    res.json({ result });

})



app.get('/get-single-task/:id', async (req, res) => {
    
    const {id} = req.params;
    const query = { _id: new ObjectId(id) }
    const result = await taskCollection.findOne(query)
    // console.log(result)
    res.json({ result });

})



app.put('/update-task', async (req, res) => {
    const { id, title, description, deadline, priority } = req.body;

    // console.log(req.body)

    const query = { _id: new ObjectId(id) }
    const update = {
        $set: {
            title,
            description,
            deadline,
            priority,
        },
    };

    const result = await taskCollection.findOneAndUpdate(query, update);

    res.json({ result });

})


app.listen(port, () => {
    console.log(`Server is running on port: http://localhost:${port}`)
})