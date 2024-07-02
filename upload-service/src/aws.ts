import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

export async function uploadFile(fileName: string, localFilePath: string) {
  const fileStream = fs.createReadStream(localFilePath);
  const params = {
    Bucket: 'faas-concept',
    Key: fileName,
    Body: fileStream
  }
  return s3.upload(params).promise();
}
