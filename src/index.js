import express, { json } from "express";
import joi from "joi";
import cors from "cors";
import dotenv from "dotenv"
import { MongoClient, ObjectId } from 'mongodb';
dotenv.config();


const app = express();
app.use(json());
app.use(cors());



const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db("test");
} catch (err) {
    console.log(err.message)
}

    
app.listen(process.env.PORT || 5001, () => {
    console.log("ffc")
})


app.get("/" , async (req, res) => {
    return res.send("oi")
})


app.post("/sign-up", async (req, res) => {
    const { username, avatar } = req.body;
    const user = req.body;

    const userSchema = joi.object({
        username: joi.string().required(),
        avatar: joi.string().required()
    });

    const validation = userSchema.validate(user, { abortEarly: false });

    if (validation.error) {
        const mensagens = validation.error.details.map(detail => detail.message);
        return res.status(422).send(mensagens);
    }

    try {

        const receitaExistente = await db.collection("users").findOne({ username: user.username });

        if (receitaExistente) {
            return res.status(409).send("Usuário já cadastrado")
        }

        await db.collection("users").insertOne(user)
        res.status(201).send("Usuário cadastrado com sucesso")

    } catch (err) {
        return res.status(500).send(err.message)
    }


})