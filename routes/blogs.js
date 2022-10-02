const { uuid } = require("uuidv4");
var express = require("express");
var router = express.Router();

const { db } = require("../mongo");

//post a blog with the following fields
/*
title: {string}
text: {string}
author: {string}
email: {string}
categories: {string []}
starRating: {number}

additionally the following fields will be added
id: {string/uuid}
lastModified: {date}
createdAt: {date}
postman example: 
{
	"title": "test",
	"text": "test",
	"author": "test",
	"email": "test",
	"categories": ["test", "test"],
	"starRating": 5
}
*/

router.post("/", async (req, res, next) => {
	const { title, text, author, email, categories, starRating } = req.body;
	const id = uuid();
	const lastModified = new Date();
	const createdAt = new Date();
	const blog = {
		id: id,
		title: title,
		text: text,
		author: author,
		email: email,
		categories: categories[0].split(","), //hacky but it works, postman doesnt like sending arrays *subtracts 1 point from postman*
		starRating,
		lastModified,
		createdAt,
	};
	if (!title || !text || !author || !email || !categories || !starRating) {
		res.status(400).send("Missing required fields");
	} else {
		try {
			const result = await db().collection("blogs").insertOne(blog);
			res.status(201).json({ message: "Blog created", blog });
		} catch (err) {
			res.status(500).json({ message: "Blog creation failed", err });
		}
	}
});

//GET ONE BLOG
router.get("/:id", async (req, res, next) => {
	const id = req.params.id;
	try {
		const blog = await db().collection("blogs").findOne({ id: id });
		if (!blog) {
			res.status(404).json({ message: "Blog not found" });
		} else {
			res.status(200).json({ message: "Blog found", blog });
		}
	} catch (err) {
		res.status(500).json({ message: "Blog retrieval failed", err });
	}
});
//get all with a loop getting one at a time
router.get("/", async (req, res, next) => {
	try {
		const blogs = await db().collection("blogs").find().toArray();
		res.status(200).json({ message: "Blogs found", blogs });
	} catch (err) {
		res.status(500).json({ message: "Blog retrieval failed", err });
	}
});

// // GET ALL BLOGS
// router.get("/get-all", async function (req, res, next) {
// 	try {
// 		(async () => {
// 			const blogPosts = await db()
// 				.collection("blogs")
// 				.find({
// 					id: {
// 						$exists: true,
// 					},
// 				})
// 				.toArray();
// 			res.json({
// 				success: true,
// 				posts: blogPosts,
// 			});
// 		})();
// 	} catch (err) {
// 		res.json({
// 			success: false,
// 			error: err,
// 		});
// 	}
// });

module.exports = router;
