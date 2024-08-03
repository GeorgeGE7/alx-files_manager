import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(request, response) {
    const authnticationHeaders = request.header('Authorization');
    if (!authnticationHeaders) {
      return;
    }
    if (typeof (authnticationHeaders) !== 'string') {
      return;
    }
    if (authnticationHeaders.slice(0, 6) !== 'Basic ') {
      return;
    }
    const authnticationHeadersdata = authnticationHeaders.slice(6);
    const decodedData = Buffer.from(authnticationHeadersdata, 'base64').toString('utf8');
    const details = decodedData.split(':'); // contains email and password
    if (details.length !== 2) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const hshdPasswod = sha1(details[1]);
    const allUsers = dbClient.db.collection('users');
    const singleuser = await allUsers.findOne({ email: details[0], password: hshdPasswod });
    if (singleuser) {
      const token = uuidv4();
      const key = `auth_${token}`;
      // Use this key for storing in Redis
      // (by using the redisClient create previously), the user ID for 24 hours
      await redisClient.set(key, singleuser._id.toString(), 862400);
      response.status(200).json({ token });
    } else {
      response.status(401).json({ error: 'Unauthorized' });
    }
  }

  static async getDisconnect(request, response) {
    const xtoken = request.header('X-Token');
    const xkey = `auth_${xtoken}`;
    const id = await redisClient.get(xkey);
    if (id) {
      await redisClient.del(xkey);
      response.status(204).json({});
    } else {
      response.status(401).json({ error: 'Unauthorized' });
    }
  }
}

module.exports = AuthController;
