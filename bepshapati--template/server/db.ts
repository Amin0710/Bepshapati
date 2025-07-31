import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
let client: MongoClient;
let db: Db;

export async function connectToDB() {
	client = new MongoClient(uri);
	await client.connect();
	db = client.db("product_ratings");
	console.log("Connected to MongoDB");
}

export { db, client };
