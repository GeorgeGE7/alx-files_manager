import sha1 from 'sha1';
import Queue from 'bull/lib/queue';
import { ObjectID } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';


const userQueue = new Queue('email sending');


class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;
    if (!email) {
      response.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
      return;
    }
    const usersCollection = dbClient.db.collection('users');
    const isEmailExist = await usersCollection.findOne({ email });
    if (isEmailExist) {
      response.status(400).json({ error: 'Already exist' });
      return;
    }

    const hshdPasswod = sha1(password);
    const entered = await usersCollection.insertOne({ email, password: hshdPasswod });
    const userID = entered.insertedId;
    userQueue.add({ userId: userID });
    response.status(201).json({ id: userID, email });
  }

  static async getMe(request, response) {
    const xtoken = request.header('X-Token');
    const xkey = `auth_${xtoken}`;
    const existingUserID = await redisClient.get(xkey);
    // convert id from string to the ObjectID format it usually is in mongodb
    const userObjId = new ObjectID(existingUserID);
    if (existingUserID) {
      const allUsers = dbClient.db.collection('users');
      const existingUser = await allUsers.findOne({ _id: userObjId });
      if (existingUser) {
        response.status(200).json({ id: existingUserID, email: existingUser.email });
      } else {
        response.status(401).json({ error: 'Unauthorized' });
      }
    } else {
      response.status(401).json({ error: 'Unauthorized' });
    }
  }
}

module.exports = UsersController;
