import express from "express";
import { client } from "./index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.route("/").get(async (req, resp) => {
  const { _id } = req.body;
  const userDetails = await client
    .db("sample")
    .collection("rentalUsers")
    .findOne({ _id: _id });
});

router.route("/addToCart").post(async (req, resp) => {
  const { productId,_id } = req.body;

  console.log(data);
  const cartItems = await client
    .db("sample")
    .collection("rentalUsers")
    .updateOne({ _id: _id }, { $set: { cartItems: productId } });
  //console.log(productList)
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
.route("/add")
.post(async(req,resp) => {
    const data = req.body
    const productList =  await client
    .db("sample")
    .collection("products")
    .insertOne(data)
    resp.send({message : "added Successfully"})
})


export const userRouter = router;
