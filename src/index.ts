import express from "express";
import cors from "cors";
import simpleGit from "simple-git";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000);
