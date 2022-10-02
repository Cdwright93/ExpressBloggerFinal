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
function validatePost(title, text, author, email, categories, starRating) {
	if (
		title === undefined ||
		title === "" ||
		title === null ||
		title === "undefined" ||
		[...title] > 30 ||
		[...title] < 3 ||
		typeof title !== "string" ||
		text === undefined ||
		text === "" ||
		text === null ||
		text === "undefined" ||
		[...text] > 1000 ||
		[...text] < 3 ||
		typeof text !== "string" ||
		author === undefined ||
		author === "" ||
		author === null ||
		author === "undefined" ||
		[...author] > 30 ||
		[...author] < 3 ||
		typeof author !== "string" ||
		email === undefined ||
		email === "" ||
		email === null ||
		email === "undefined" ||
		[...email] > 30 ||
		[...email] < 3 ||
		typeof email !== "string" ||
		starRating === undefined ||
		starRating === "" ||
		starRating === null ||
		starRating === "undefined" ||
		typeof starRating !== "number" ||
		starRating > 5 ||
		starRating < 1
	) {
		if (!title) {
			console.log("title is not valid");
			("Title is required");
		}
		if (!text) {
			console.log("text is not valid");
			("Text is required");
		}
		if (!author) {
			console.log("author is not valid");
			("Author is required");
		}
		if (!email) {
			console.log("email is not valid");
			("Email is required");
		}
		if (!categories) {
			console.log("categories is not valid");
			("Categories is required");
		}
		if (!starRating) {
			console.log("starRating is not valid");
			("Star Rating is required");
		}
		if (title.length > 30) {
			console.log("title is too long");
			("Title is too long");
		}
		if (title.length < 3) {
			console.log("title is too short");
			("Title is too short");
		}
		if (text.length > 1000) {
			console.log("text is too long");
			("Text is too long");
		}
		if (text.length < 3) {
			console.log("text is too short");
			("Text is too short");
		}
		if (author.length > 30) {
			console.log("author is too long");
			("Author is too long");
		}
		if (author.length < 3) {
			console.log("author is too short");
			("Author is too short");
		}
		if (email.length > 30) {
			console.log("email is too long");
			("Email is too long");
		}
		if (email.length < 3) {
			console.log("email is too short");
			("Email is too short");
		}
		if (categories.length > 30) {
			console.log("categories is too long");
			("Categories is too long");
		}
		if (categories.length < 3) {
			console.log("categories is too short");
			("Categories is too short");
		}
		if (starRating > 5) {
			console.log("starRating is too high");
			("Star Rating is too high");
		}
		if (starRating < 1) {
			console.log("starRating is too low");
			("Star Rating is too low");
		}

		return false;
	}
	return true;
}

router.post("/", async (req, res, next) => {
	const { title, text, author, email, categories, starRating } = req.body;
	if (
		validatePost(title, text, author, email, categories, starRating) === true
	) {
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
		const result = await db().collection("blogs").insertOne(blog);
		res.status(201).json(result);
	} else {
		try {
			const result = await db().collection("blogs").insertOne(blog);
			res.status(201).json({ message: "Blog created", blog });
		} catch (err) {
			res.status(500).json({ message: "Blog creation failed", err });
			console.log();
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
