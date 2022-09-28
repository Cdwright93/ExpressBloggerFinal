const { uuid } = require("uuidv4");
var express = require("express");
var router = express.Router();

const { db } = require("../mongo");

router.get("/get-one-example", async function (req, res, next) {
	const blogPost = await db()
		.collection("blogs")
		.findOne({
			id: {
				$exists: true,
			},
		});
	res.json({
		success: true,
		post: blogPost,
	});
});

router.get("/get-all-examples", async function (req, res, next) {
	const blogPosts = await db()
		.collection("blogs")
		.find({
			id: {
				$exists: true,
			},
		})
		.toArray();
	res.json({
		success: true,
		posts: blogPosts,
	});
});

module.exports = router;
