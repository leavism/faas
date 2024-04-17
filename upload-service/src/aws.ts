import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

export const uploadFile = async (fileName: string, filePath: string) => {
  const fileContent = fs.readFileSync(filePath);
  const response = await s3
    .upload({
      Body: fileContent,
      Bucket: "faas-concept",
      Key: fileName,
    })
    .promise();

  console.log(response);
};
