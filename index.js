import express from "express"
import  {productRouter} from "./getProducts.js";
import  {userRouter} from "./user.js";
import cors from "cors";
import { MongoClient } from "mongodb";



const app = express();
const PORT = 9000;
const URL = "mongodb+srv://Gokul:abcd1234@cluster0.bmifn.mongodb.net"
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
    console.log(e)
}
app.listen(PORT, ()=>{console.log("Server Started")})

