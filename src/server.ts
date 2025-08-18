import { buildApp } from './app.js';
import { env } from './env/index.js';

const app = buildApp();

app.listen({
  port: env.PORT,
  host: env.HOST,
}).then(() => {
  console.log(`Server is running on http://${env.HOST}:${env.PORT}`);
}).catch((err: unknown) => {
  if (err instanceof Error) {
    app.log.error(err);
  } else {
    console.error("An unknown error occurred while starting the server");
  }
  process.exit(1);
});
