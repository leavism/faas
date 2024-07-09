import cors from "cors";
import express from "express";
import path from "path";
import simpleGit from "simple-git";
import { generate, getAllFiles } from "./utils";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const redisParams = {
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
}
const publisher = createClient(redisParams);
publisher.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  const id = generate();
  const outputPath = `output/${id}`;

  await simpleGit().clone(repoUrl, path.join(__dirname, outputPath));

  let files = getAllFiles(path.join(__dirname, outputPath));
  for (const file of files) {
    console.log(`Uploading: ${file}`)
    await uploadFile(file.slice(__dirname.length + 1), file);
  }
  
  publisher.lPush("build-queue", id);

  res.json({
    id: id,
  });
});

app.listen(3000);
