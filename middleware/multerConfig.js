const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// validating the filetype
		const allowedFileTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
		];

		if (!allowedFileTypes.includes(file.mimetype)) {
			const error = new Error("Wrong file type");
			error.code = "LIMIT_FILE_TYPES";
			return cb(error, false);
		}

		cb(null, "./uploads");
	},
	filename: function (req, file, cb) {
		console.log(file);
		cb(null, Date.now() + "_" + file.originalname);
	},
});

module.exports = {
	multer,
	storage,
};
