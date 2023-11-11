const express = require("express");
const app = express();
app.use(express.json());
require("./model/index");

const { blogs } = require("./model/index");
const { multer, storage } = require("./middleware/multerConfig");

const upload = multer({ storage });

// request access for uploads folder
app.use("/uploads", express.static("uploads"));

app.post("/blogs", upload.single("blogImage"), async (req, res) => {
	const { title, subTitle, description } = req.body;
	const imageUrl =
		req.protocol +
		"://" +
		req.get("host") +
		"/uploads/" +
		req.file.filename;

	const blog = await blogs.create({
		title,
		subTitle,
		description,
		imageUrl,
	});

	res.status(200).json({
		success: true,
		data: blog,
		message: "Blog Added Successfully.",
	});
});

app.get("/blogs", async (req, res) => {
	const allBlogs = await blogs.findAll();

	res.status(200).json({
		success: true,
		message:
			allBlogs.length == 0
				? "No Blog Found."
				: "Blogs Fetched Successfully.",
		data: allBlogs,
	});
});

app.get("/blogs/:id", async (req, res) => {
	const id = req.params.id;
	const blog = await blogs.findByPk(id);

	if (blog) {
		res.status(200).json({
			success: true,
			data: blog,
		});
	}

	res.status(400).json({
		success: false,
		message: "Blog Not Found.",
	});
});

app.delete("/blogs/:id", async (req, res) => {
	const id = req.params.id;
	await blogs.destroy({
		where: { id: id },
	});

	res.status(200).json({
		success: true,
		message: "Blog Deleted Successfully.",
	});
});

app.put("/blogs/:id", async (req, res) => {
	const body = req.body;
	let blog = await blogs.findByPk(req.params.id);

	if (!blog) {
		res.status(400).json({
			success: false,
			message: "Blog Not Found.",
		});
	}

	await blogs.update(body, { where: { id: req.params.id } });

	blog = await blogs.findByPk(req.params.id);

	res.status(200).json({
		success: true,
		data: blog,
		message: "Blog Updated Successfully.",
	});
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
