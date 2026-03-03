import LogSchema from '../db/log.js';

export default async function errorLog(message) {
  return await new LogSchema({ message }).save();
}
