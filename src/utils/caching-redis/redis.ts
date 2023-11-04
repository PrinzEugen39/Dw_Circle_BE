import { createClient } from "redis";

const RedisClient = createClient({
  password: "jDKeRVP4nsNY8STQ42uRxtEGetaBr1QK",
  socket: {
    host: "redis-19433.c295.ap-southeast-1-1.ec2.cloud.redislabs.com",
    port: 19433,
  },
});

RedisClient.on("error", (error) => {
  console.log("Redis Client", error);
  process.exit(1);
});

export async function redisConnect() {
  try {
    await RedisClient.connect();
    console.log("Connected To Redis");
  } catch (error) {
    console.log("Redis Client", error);
    process.exit(1);
  }
}

const DEFAULT_EXPIRATION = 3600;

export { RedisClient, DEFAULT_EXPIRATION }