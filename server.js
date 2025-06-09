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
    const result = await mammoth.convertToHtml({
      path: filePath, // Example: if equations are in a specific custom XML tag
      customXml: {
        "m:oMath": function (element) {
          // 'element' would contain the OMML XML.
          // You'd need to parse this OMML into a renderable format (like MathML or LaTeX) here.
          // This is a complex task requiring another library or a custom parser.
          return {
            elementName: "span",
            attributes: { "data-math-omml": element.children[0].value }, // Store raw OMML
            children: []
          };
        }
      }
    });

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
