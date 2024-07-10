import { S3 } from "aws-sdk";
import path from "path";
import fs from "fs";

const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

export async function downloadS3Folder(s3Path: string) {
  const files = await listS3Files(s3Path);
  if (files.length === 0) {
    console.log('No files found in specified path.');
    return;
  }

  for (const file of files) {
    const key = file.Key
    if (!key) {
      return;
    }
    const downloadPath = path.join(__dirname, key)
    const dirName = path.dirname(downloadPath)
    if(!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName, {recursive: true})
    }

    await downloadFile(key, downloadPath)
  }
}

const downloadFile = (key: string, outputPath: string) => {
  return new Promise((resolve, reject) => {
    const params = { Bucket: 'faas-concept', Key: key };
    const fileStream = fs.createWriteStream(outputPath);

    s3.getObject(params).createReadStream()
      .on('error', reject)
      .pipe(fileStream)
      .on('error', reject)
      .on('close', resolve)
  })
}

const listS3Files = async(s3Path: string) => {
  const params = {
    Bucket: 'faas-concept',
    Prefix: s3Path
  };

  const response = await s3.listObjectsV2(params).promise();
  return response.Contents || [];
}

export async function uploadBuild(id: string) {
  const folderPath = path.join(__dirname, `output/${id}/out`);
  const files = getAllFiles(folderPath);

  for (const file of files) {
    console.log(`Uploading: ${file}`)
    await uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
  }
  
}

const getAllFiles = (folderPath: string) => {
  let response: string[] = [];

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach(file => {
    const fullFilePath = path.join(folderPath, file);
    if (fs.statSync(fullFilePath).isDirectory()) {
      response = response.concat(getAllFiles(fullFilePath))
    } else {
      response.push(fullFilePath);
    }
  });
  return response;
}

const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileStream = fs.createReadStream(localFilePath);
  
  const isSVG = path.extname(fileName).toLowerCase() === '.svg';

  const params = isSVG ? {
    Bucket: 'faas-concept',
    Key: fileName,
    Body: fileStream,
    ACL: 'public-read',
    ContentType: 'image/svg+xml'
  } : {
    Bucket: 'faas-concept',
    Key: fileName,
    Body: fileStream
  };

  return s3.upload(params).promise();
};
