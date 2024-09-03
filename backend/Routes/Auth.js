const express = require('express')
const User = require('../models/User')
const Order = require('../models/Orders')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const axios = require('axios')
const fetch = require('../middleware/fetchdetails');
const jwtSecret = "HaHa";
const mongoose = require('mongoose')

const razorpay = require('razorpay')
const dotenv = require("dotenv");
const crypto = require("crypto")
const Payment = require('../models/Payments')
dotenv.config();

const instance = new razorpay({
    key_id: process.env.RZP_KEY,
    key_secret: process.env.RZP_SECRET,
})

// var foodItems= require('../index').foodData;
// require("../index")
//Creating a user and storing data to MongoDB Atlas, No Login Requiered
router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }
    // console.log(req.body)
    // let user = await User.findOne({email:req.body.email})
    const salt = await bcrypt.genSalt(10)
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
        await User.create({
            name: req.body.name,
            // password: req.body.password,  first write this and then use bcryptjs
            password: securePass,
            email: req.body.email,
            location: req.body.location
        }).then(user => {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret);
            success = true
            res.json({ success, authToken })
        })
            .catch(err => {
                console.log(err);
                res.json({ error: "Please enter a unique value." })
            })
    } catch (error) {
        console.error(error.message)
    }
})

// Authentication a User, No login Requiered
router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });  //{email:email} === {email}
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password); // this return true false.
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success, authToken })


    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})

// Get logged in User details, Login Required.
router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password") // -password will not pick password from db.
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})
// Get logged in User details, Login Required.
router.post('/getlocation', async (req, res) => {
    try {
        let lat = req.body.latlong.lat
        let long = req.body.latlong.long
        // console.log(lat, long)
        let location = await axios
            .get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=74c89b3be64946ac96d777d08b878d43")
            .then(async res => {
                // console.log(res.data.results)
                // let response = res.data.results[0].components;
                // console.log(res.data.results[0].formatted);
                return (res.data.results[0].formatted);
            })
            .catch(error => {
                console.error(error)
            })
        // console.log(location);
        res.json(location)
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})
router.post('/foodData', async (req, res) => {
    try {
        

        const foodCollection = await mongoose.connection.db.collection("food_items").find().toArray();
        
        const foodCategory = await mongoose.connection.db.collection("food_category").find().toArray();

        // console.log(foodCollection);


        res.json({foodCollection, foodCategory})

    } catch (error) {
        console.error(error.message)
        res.json({"error":"Server Error"})

    }
})

router.post('/orderData', async (req, res) => {
    let data = req.body.order_data
    // await data.splice(0,0,{order_date:req.body.order_date})

    //if email not exisitng in db then create: else: InsertMany()
    // let eId = await Order.findOne({ 'email': req.body.email })    
    // console.log(eId)
    // if (eId===null) {
    try {
        await Order.create({
            email: req.body.email,
            order_data: data
        }).then(() => {
            res.json({ success: true })
        })
    } catch (error) {
        console.log(error.message)
        res.send("Server Error", error.message)

    }
    // }

    // else {
    //     try {
    //         await Order.findOneAndUpdate({email:req.body.email},
    //             { $push:{order_data: data} }).then(() => {
    //                 res.json({ success: true })
    //             })
    //     } catch (error) {
    //         console.log(error.message)
    //         res.send("Server Error", error.message)
    //     }
    // }
})

router.post('/myOrderData', async (req, res) => {
    try {
        // console.log(req.body.email)
        let eId = await Order.find({ 'email': req.body.email })
        // console.log(eId)
        res.json(eId)
    } catch (error) {
        res.send("Error", error.message)
    }


});

router.post('/profileData', async (req, res) => {
    try {
        // console.log(req.body.email)
        let data = await User.find({ 'email': req.body.email })
        console.log(data)
        res.json(data)
    } catch (error) {
        res.send("Error", error.message)
    }


});


router.post("/checkout", async (req, res) => {
    try {

        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        // console.log(order);


        if (order.id) {
            let data = req.body.order_data

            // console.log(order);
            await Order.create({
                email: req.body.email,
                order_data: data,
                payment_order_id: order.id
            }).then(() => {
                res.json(order)
            })

        } else {
            res.send("Error", error.message)

        }


        // res.send(order)

    } catch (error) {
        res.send("Error", error.message)
    }



})

router.post("/getkey", async (req, res) => {
    res.json({ key: process.env.RZP_KEY })
})


router.post("/paymentverification", async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedsgnature = crypto.createHmac('sha256', process.env.RZP_SECRET).update(body.toString()).digest('hex')
        const isauth = expectedsgnature === razorpay_signature;
        if (isauth) {
            await Payment.create({
                razorpay_order_id, razorpay_payment_id, razorpay_signature
            }).then(() => {
                var myquery = { payment_order_id: razorpay_order_id };
                var newvalues = { $set: { is_paid: true } };


                Order.findOneAndUpdate({ payment_order_id: razorpay_order_id }, newvalues, function (err, place) {
                    res.redirect(`${process.env.REACT_APP_BASE_URL}/paymentsuccess?reference=${razorpay_payment_id}`)

                });

            })
        }
        else {
            res.status(400).json({ success: false });
        }

    } catch (error) {
        res.status(400).json({ success: false });
    }
})

module.exports = router