const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
app.use(express.json());

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = path.join(__dirname, req.file.path);
    const result = await mammoth.convertToHtml({ path: filePath });

    // Simplified JSON wrapping HTML content
    const json = { content: result.value };

    fs.unlinkSync(filePath); // Clean up uploaded file
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: "Failed to process document", details: err });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
