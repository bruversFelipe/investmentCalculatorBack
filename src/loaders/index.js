import mongo from './mongo.js';
import expressLoader from './express.js';

export default async function ({ app }) {
  await expressLoader({ app });
  await mongo();
  console.log('express loaded');
}
