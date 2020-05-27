import { ModelsManagerApplication } from './application';
import { ApplicationConfig } from '@loopback/core';
import * as dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import { getDbConnectionOptions } from './utils/connection';

export async function main(options: ApplicationConfig = {}) {
  dotenv.config({ path: '../../.env' });

  const app = new ModelsManagerApplication(options);

  await createConnection(getDbConnectionOptions());

  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

const config = {
  rest: {
    port: +(process.env.PORT ?? 3000),
    host: process.env.HOST,
    openApiSpec: {
      // useful when used with OASGraph to locate your application
      setServersFromRequest: true,
    },
  },
};
main(config).catch((err) => {
  console.error('Cannot start the application.', err);
  process.exit(1);
});