import express from "express";
import { client } from "./index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "bson";

const router = express.Router();

router.route("/").get(async (req, resp) => {
  const { _id } = req.body;
  const userDetails = await client
    .db("sample")
    .collection("rentalUsers")
    .findOne({ _id: _id });
});

router
.route("/addToCart")
.post(async (req, resp) => {
  const { product ,_id } = req.body;
  const objId = new ObjectId(_id)
  console.log(_id);
  const cartItems = await client
    .db("sample")
    .collection("rentalUsers")
    .updateOne({ _id: objId }, { $push: { cartItems: product } });
  //console.log(productList)
  console.log(cartItems)
  resp.send({message : "added to cart successfully"});
});

router
.route("/register")
.post(async (req, resp) => {
  try {
    const { name, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUserNames = await client
      .db("sample")
      .collection("rentalUsers")
      .find({})
      .toArray();

    if (existingUserNames.find((e) => e.name == name)) {
      console.log("username already in use");
      throw { message: "username already in use",error : true };
    //   resp.status(400).send({ message: "username already in use" , error : true});
    } else {
        const userRole = "customer"
        const cartItems = [];
      const users = await client
        .db("sample")
        .collection("rentalUsers")
        .insertOne({name, hashedPassword, userRole,cartItems})
        resp.send({ message: "succesfully registered",error : false });
    }
    
  }catch (e) {
    resp.send(e);
  }
});

router
.route("/login")
.post(async(req,res) => {
    console.log("inside login")
    const {name, password} = req.body
    const user = await client
    .db("sample")
    .collection("rentalUsers")
    .findOne({name:name});
    if(user) {
        const passwordFromDB = user.hashedPassword;
        // console.log(user,password,passwordFromDB)
        const isPasswordMatch = await bcrypt.compare(password, passwordFromDB);
        
        if(isPasswordMatch){
            const key = process.env.SECRET_KEY||"token"
            const jwtToken = jwt.sign({id : user._id},key)
            console.log(jwtToken)
            res.send({message : "successful login",jwtToken,user})
        } 
        else {
            res.status(400).send({message : "invalid credentials"});
        }
    }
    else {
        res.status(400).send({message : "invalid credentials"});
    }
})

router
.route("/getCartDetails")
.post(async(req,resp) => {
    console.log("inside getCartDetails")
    const _id = new ObjectId(req.body._id)
    const cartDetails =  await client
    .db("sample")
    .collection("rentalUsers")
    .findOne({_id : _id},{cartItems : 1})
    console.log(cartDetails.cartItems)
    resp.send(cartDetails.cartItems)
})

router
.route("/addDeliveryAddress")
.post(async(req,resp) => {
  const _id = new ObjectId(req.body._id)
  const addDeliveryAddress = await client
  .db("sample")
  .collection("rentalUsers")
  .updateOne({ _id: _id }, { $set: { deliveryAddress: req.body } })
  resp.send(addDeliveryAddress)
})


export const userRouter = router;
