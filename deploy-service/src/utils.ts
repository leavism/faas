import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";

export async function buildProject(id: string) {
  const configPath = path.join(__dirname, `output/${id}/next.config.mjs`);
  let configFile = await fs.readFile(configPath, "utf8");
  
  const modifiedConfig = configFile.replace(
    "const nextConfig = {};",
    "const nextConfig = { output: 'export', images: { loader: 'custom', loaderFile: './s3loader.ts'} };"
  );

  await fs.writeFile(configPath, modifiedConfig, "utf8");

  const s3LoaderPath = path.join(__dirname, `output/${id}/s3loader.ts`);
  const s3LoaderContent = `'use client'

export default function myImageLoader({ src, width, quality }) {
  const id = '${id}'
  return \`https://faas-concept.s3.us-west-1.amazonaws.com/dist/\${id}\${src}\`
}
`;

  await fs.writeFile(s3LoaderPath, s3LoaderContent, "utf8");

  return new Promise((resolve) => {
    const child = exec(
      `cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`,
    );

    child.stdout?.on("data", function (data) {
      console.log("stdout: " + data);
    });

    child.stderr?.on("data", function (data) {
      console.log("stderr: " + data);
    });

    child.on("close", function (code) {
      resolve("");
    });
  });
}
