import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import { connectToDB, db } from "./db.js";
import { ProductDB } from "../src/types/types.js";
import { MongoServerError, ObjectId } from "mongodb";

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

app.get("/api/products/:id", async (req, res) => {
	try {
		const productIdStr = req.params.id;

		if (!ObjectId.isValid(productIdStr)) {
			return res.status(400).json({ error: "Invalid product ID format" });
		}

		const product = await db
			.collection<ProductDB>("products")
			.findOne({ _id: new ObjectId(productIdStr) });

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		// Convert ObjectId and Date to string for frontend
		const productResponse = {
			...product,
			_id: product._id?.toString(),
			createdAt: product.createdAt?.toISOString(),
		};

		res.json(productResponse);
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
		if (!req.body.name || !Array.isArray(req.body.imageUrls)) {
			return res
				.status(400)
				.json({ error: "Missing required fields: name and imageUrls" });
		}

		// Create product object without 'id' field
		const product = {
			name: req.body.name,
			imageUrls: req.body.imageUrls,
			ratings: {
				nifar: req.body.ratings?.nifar || 0,
				afia: req.body.ratings?.afia || 0,
				sijil: req.body.ratings?.sijil || 0,
				naim: req.body.ratings?.naim || 0,
			},
			comment: req.body.comment || "",
			createdAt: new Date(),
		};

		// Insert into MongoDB
		const result = await db.collection("products").insertOne(product);

		res.status(201).json({
			...product,
			_id: result.insertedId.toString(),
		});
	} catch (error) {
		if (error instanceof MongoServerError && error.code === 11000) {
			return res
				.status(409)
				.json({ error: "Product with this ID already exists" });
		}
		if (error instanceof Error) {
			return res.status(500).json({ error: error.message });
		}
		res.status(500).json({ error: "Unknown error occurred" });
	}
});

app.put("/api/products/:id", async (req, res) => {
	try {
		const productIdStr = req.params.id;

		// Validate ObjectId format
		if (!ObjectId.isValid(productIdStr)) {
			return res.status(400).json({ error: "Invalid product ID format" });
		}

		const { ratings, comment } = req.body;

		if (!ratings && comment === undefined) {
			return res.status(400).json({ error: "Must provide ratings or comment" });
		}

		const updateData: Partial<ProductDB> = {};

		if (ratings) {
			const existingProduct = await db
				.collection<ProductDB>("products")
				.findOne({ _id: new ObjectId(productIdStr) });
			if (!existingProduct) {
				return res.status(404).json({ error: "Product not found" });
			}

			updateData.ratings = {
				nifar: ratings.nifar ?? existingProduct.ratings.nifar,
				afia: ratings.afia ?? existingProduct.ratings.afia,
				sijil: ratings.sijil ?? existingProduct.ratings.sijil,
				naim: ratings.naim ?? existingProduct.ratings.naim,
			};
		}

		if (comment !== undefined) {
			updateData.comment = comment;
		}

		const result = await db
			.collection<Omit<ProductDB, "_id"> & { _id: ObjectId }>("products")
			.updateOne({ _id: new ObjectId(productIdStr) }, { $set: updateData });

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
