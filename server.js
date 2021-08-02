const   express     = require("express"),
        app         = express(),
        mongoose    = require("mongoose"),
        bodyParser  = require("body-parser"),
        multer      = require("multer"),
        upload      = multer()
        clearCache   = require('./services/cache')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// MONGODB SETUP

// mongoose.connect('mongodb://localhost:27017/redisdemo',{
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
mongoose.connect('mongodb://mongodb.default.svc.cluster.local:27017/redisdemo',{
    auth: {"authSource": "admin"},
    user: "admin",
    pass: "password",
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection
        .once('open', ()=>console.log('connected to database'))
        .on('error',(err)=>console.log("connection to database failed!!",err))

const vehicle = require('./models/vehicle');

app.use(upload.array()); 
app.use(express.static('public'));

// ROUTES

app.get('/',(req,res)=>{
    vehicle.find({})
            .then((data)=>{
                res.json({found: true, data: data});
            })
            .catch((err)=>{
                console.log(err)
                res.json({found: false, data: null});
            })
})

app.post('/vehicle',(req,res)=>{
    new vehicle(req.body)
        .save()
        .then((v_data)=>{
            console.log(v_data);
            res.json({save: true})
            clearCache(v_data.vehicleType)
        })
        .catch((err)=>{
            console.log(err)
            res.json({save: false})
        })
})

app.get('/:vehicleType/', (req,res)=>{
    vehicle.find({vehicleType: req.params.vehicleType})
                .cache(req.params.vehicleType)
                .then((data)=>{
                    if(data){
                        res.json({found: true, data: data})
                    }else{
                        res.json({found: false, data: null})
                    }
                })
                .catch((err)=>{
                    console.log(err)
                    res.json({found: false, data: null})
                })
})

app.get('/:vehicleType/:sno', (req,res)=>{
    vehicle.findOne({serialno: req.params.sno,vehicleType: req.params.vehicleType})
                .cache(req.params.vehicleType)
                .then((data)=>{
                    if(data){
                        res.json({found: true, data: data})
                    }else{
                        res.json({found: false, data: null})
                    }
                })
                .catch((err)=>{
                    console.log(err)
                    res.json({found: false, data: null})
                })
})

app.listen(3000,()=>console.log("server started at port:3000"))

// 'use strict';

// const express = require('express')

// // Constants
// const PORT = 8080;
// const HOST = '0.0.0.0';

// //App
// const app = express();
// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

// app.listen(PORT, HOST);
// console.log(`Running on http://${HOST}:${PORT}`);