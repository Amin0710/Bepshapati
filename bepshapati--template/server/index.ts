import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import { connectToDB, db } from "./db.js";
import { Product } from "../src/types/types.js";

const app: Express = express();
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
app.use(express.json());

// Connect to DB
connectToDB();

// Routes
app.get("/api/products", async (req, res) => {
	const products = await db.collection<Product>("products").find().toArray();
	res.json(products);
});

app.post("/api/products", async (req, res) => {
	const result = await db.collection<Product>("products").insertOne({
		...req.body,
		createdAt: new Date(),
	});
	res.status(201).json({ ...req.body, _id: result.insertedId });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
