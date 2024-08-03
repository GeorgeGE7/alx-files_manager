import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Class to define methods for redis commands
 */
class RedisClient {
  /**
   * constructor function
   */
  constructor() {
    this.client = createClient();
    this.client.on('error', (error) => {
      console.log(`Redis client not connected to server: ${error}`);
    });
  }

  /**
   * Check connection status and report
   * @returns {boolean} - true if connected, false otherwise
   */
  isAlive() {
    if (this.client.connected) {
      return true;
    }
    return false;
  }

  /**
   * Get value for given key from redis server
   * @param {string} key - The key to get the value for
   * @returns {Promise<string|null>} - The value for the key, or null if not found
   */
  async get(key) {
    const invCmd = promisify(this.client.get).bind(this.client);
    const data = await invCmd(key);
    return data;
  }

  /**
   * Set key value pair to redis server
   * @param {string} key - The key to set the value for
   * @param {string} value - The value to set
   * @param {number} time - The time in seconds to expire the key
   */
  async set(key, value, time) {
    const putCmd = promisify(this.client.set).bind(this.client);
    await putCmd(key, value);
    await this.client.expire(key, time);
  }

  /**
   * Delete key value pair from redis server
   * @param {string} key - The key to delete
   */
  async del(key) {
    const removecmd = promisify(this.client.del).bind(this.client);
    await removecmd(key);
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
