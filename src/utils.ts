import fs from "fs";
import path from "path";

export function generate(len = 5) {
  const subset = "123456789qwertyuiopasdfghjklzxcvbnm";
  let id = "";
  for (let i = 0; i < len; i++) {
    id += subset[Math.floor(Math.random() * subset.length)];
  }
  return id;
}

export function getAllFiles(folderPath: string) {
  let pathsList: string[] = [];

  const allFilesAndFolders = fs.readdirSync(folderPath);
  allFilesAndFolders.forEach((file) => {
    const fullFilePath = path.join(folderPath, file);

    if (fs.statSync(fullFilePath).isDirectory()) {
      pathsList = pathsList.concat(getAllFiles(fullFilePath));
    } else {
      pathsList.push(fullFilePath);
    }
  });

  return pathsList;
}
