import { MongoClient } from 'mongodb';

/**
 * Database client
 * @module utils/db
 */

/**
 * Database client
 * @class
 */
class DBClient {
  /**
   * Constructor for the DBClient
   * @constructor
   */
  constructor() {
    const databaseHost = process.env.DB_HOST || 'localhost';
    const databasePort = process.env.DB_PORT || 27017;
    const databaseName = process.env.DB_DATABASE || 'files_manager';
    const databaseUri = `mongodb://${databaseHost}:${databasePort}`;

    MongoClient.connect(databaseUri, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        this.db = client.db(databaseName);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      } else {
        console.log(err.message);
        this.db = false;
      }
    });
  }

  /**
   * Check if the database connection is alive
   * @returns {boolean} - true if alive, false otherwise
   */
  isAlive() {
    return Boolean(this.db);
  }

  /**
   * Get the number of users in the database
   * @returns {Promise<number>} - The number of users
   */
  async nbUsers() {
    const numberOfUsers = this.usersCollection.countDocuments();
    return numberOfUsers;
  }

  /**
   * Get the number of files in the database
   * @returns {Promise<number>} - The number of files
   */
  async nbFiles() {
    const numberOfFiles = this.filesCollection.countDocuments();
    return numberOfFiles;
  }
}

const dbClient = new DBClient();

export default dbClient;
