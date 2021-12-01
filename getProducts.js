import  express  from "express";
import { client } from "./index.js";
import { auth } from "./middleware/auth.js"

const router = express.Router()

router
.route(auth,"/")
.get(async(req,resp) => {
 const productList =  await client
 .db("sample")
 .collection("products")
 .find({}).toArray()
 //console.log(productList)
 resp.send(productList)
})


export const productRouter = router;