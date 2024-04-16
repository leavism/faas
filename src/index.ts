import cors from "cors";
import express from "express";
import path from "path";
import simpleGit from "simple-git";
import { generate, getAllFiles } from "./utils";
import { uploadFile } from "./aws";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generate();
  const outputPath = `output/${id}`;

  await simpleGit().clone(repoUrl, path.join(__dirname, outputPath));

  let files = getAllFiles(path.join(__dirname, outputPath));
  files.forEach(async (file) => {
    await uploadFile(file.slice(__dirname.length + 1), file);
  });

  res.json({
    id: id,
  });
});

app.listen(3000);
