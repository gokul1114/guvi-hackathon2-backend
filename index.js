import express from "express"
import  {productRouter} from "./getProducts.js";
import  {userRouter} from "./user.js";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";


dotenv.config()
const app = express();
const PORT = process.env.PORT || 9000;
const URL = process.env.URL ;
app.use(express.json())
app.use(cors())

async function createConnection(){
    const client = new MongoClient(URL)
    client.connect()
    console.log("db connected")
    return client;
}
export const client = await createConnection()

app.get("/",(req,resp) => {
    resp.send("Hello World 🌍")
})
try {
app.use("/getProducts", productRouter) 
app.use("/user",userRouter)
}
catch(e) {
    console.log("error inside try",e)
}
app.listen(PORT, ()=>{console.log("Server Started")})

