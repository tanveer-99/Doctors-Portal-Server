const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { default: axios } = require('axios');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2gqn9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
    res.send("DB working");
    console.log("DB working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointments");
  const doctorCollection = client.db("doctorsPortal").collection("doctors");

  app.post('/addAppointment', (req, res) => {
      const appointment = req.body;
      console.log(appointment);
      appointmentCollection.insertOne(appointment).
      then(result => {
          res.send(result.insertedCount > 0);
      })
  })

  app.post('/appointmentsByDate', (req, res)=> {
    const email = req.body;
    doctorCollection.find({email : email.email})
    .toArray((err, documents) => {
        if(documents.length > 0) {
            const isDoctor = true;
            appointmentCollection.find()
              .toArray((err, documents) => {
                  res.send(documents);
              })

        }
        else {

            const isDoctor = false;
            appointmentCollection.find({email : email.email})
              .toArray((err, documents) => {
                  res.send(documents);
              })

        }
    })
  })

  app.post('/isDoctor', (req, res)=> {
    const email = req.body;
    doctorCollection.find({email : email.email})
    .toArray((err, documents) => {
            res.send(documents.length > 0);   
    })
  })

  app.post('/addADoctor',(req, res)=> {
      const doctorInfo = req.body.doctorInfo;
      doctorCollection.insertOne(doctorInfo)
      .then(result => {
          res.send(result.insertedCount>0);
      })
  })



  


console.log("database connected")
});

app.listen(process.env.PORT || port);


