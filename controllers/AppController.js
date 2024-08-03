import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  static getStatus(request, response) {
    const statusForDb = dbClient.isAlive();
    const statusForRed = redisClient.isAlive();
    response.status(200).send({ redis: statusForRed, db: statusForDb });
  }

  static async getStats(request, response) {
    const filesdOcsCount = await dbClient.nbFiles();
    const usrDocsCount = await dbClient.nbUsers();
    response.status(200).send({ users: usrDocsCount, files: filesdOcsCount });
  }
}
module.exports = AppController;
