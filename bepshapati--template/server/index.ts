import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import { connectToDB, db } from "./db.js";
import { Product } from "../src/types/types.js";
import { MongoServerError } from "mongodb";

const app: Express = express();
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Connect to DB
(async () => {
	await connectToDB();
	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
})();

// Routes
app.get("/", (req, res) => {
	res.send("Bepshapati API is running!");
});

// Products API routes
app.get("/api/products", async (req, res) => {
	try {
		const products = await db.collection("products").find().toArray();
		res.json(products);
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: "An unknown error occurred" });
		}
	}
});

app.post("/api/products", async (req, res) => {
	try {
		// 1. Validate request body
		if (!req.body.name || !req.body.imageUrl) {
			return res
				.status(400)
				.json({ error: "Missing required fields: name and imageUrl" });
		}

		// 2. Create product document
		const product: Product = {
			id: Date.now(), // Better than length+1 for unique IDs
			name: req.body.name,
			imageUrl: req.body.imageUrl,
			ratings: {
				nifar: req.body.ratings?.nifar || 0,
				afia: req.body.ratings?.afia || 0,
				sijil: req.body.ratings?.sijil || 0,
				naim: req.body.ratings?.naim || 0,
			},
			comment: req.body.comment || "",
			createdAt: new Date(),
		};

		// 3. Insert into MongoDB
		const result = await db.collection<Product>("products").insertOne(product);

		// 4. Return success response
		res.status(201).json({
			...product,
			_id: result.insertedId,
		});
	} catch (error: unknown) {
		// Handle specific MongoDB errors
		if (error instanceof MongoServerError) {
			if (error.code === 11000) {
				// Duplicate key error
				return res.status(409).json({
					error: "Product with this ID already exists",
				});
			}
			return res.status(500).json({
				error: "Database operation failed",
				details: error.errmsg,
			});
		}

		// Generic error handling
		if (error instanceof Error) {
			return res.status(500).json({
				error: error.message,
			});
		}

		res.status(500).json({
			error: "Unknown error occurred",
		});
	}
});

app.put("/api/products/:id/ratings", async (req, res) => {
	try {
		const productId = parseInt(req.params.id);
		const { ratings, comment } = req.body;

		// Validate input
		if (!ratings && !comment) {
			return res.status(400).json({ error: "Must provide ratings or comment" });
		}

		const updateData: Partial<Product> = {};

		if (ratings) {
			updateData.ratings = {
				nifar: ratings.nifar ?? 0,
				afia: ratings.afia ?? 0,
				sijil: ratings.sijil ?? 0,
				naim: ratings.naim ?? 0,
			};
		}

		if (comment !== undefined) {
			updateData.comment = comment;
		}

		// MongoDB update
		const result = await db
			.collection<Product>("products")
			.updateOne({ id: productId }, { $set: updateData });

		if (result.matchedCount === 0) {
			return res.status(404).json({ error: "Product not found" });
		}

		res.status(200).json({
			message: "Ratings/comment updated successfully",
			updatedFields: Object.keys(updateData),
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: "Unknown error occurred" });
		}
	}
});

// Users API routes
app.get("/api/users", async (req, res) => {
	try {
		const users = await db.collection("users").find().toArray();
		res.json(users);
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ error: error.message });
		} else {
			res.status(500).json({ error: "An unknown error occurred" });
		}
	}
});
