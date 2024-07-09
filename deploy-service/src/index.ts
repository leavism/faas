import { commandOptions, createClient } from "redis";
import { downloadS3Folder, uploadBuild } from "./aws";
import { buildProject } from "./utils";

const redisParams = {
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
}
const subscriber = createClient(redisParams);
subscriber.connect();

async function main() {
  while (1) {
    const response = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    );

    const id = response!.element;

    await downloadS3Folder(`output/${id}`);
    console.log("Downloaded!");
    await buildProject(id);
    await uploadBuild(id);
  }
}

main();
