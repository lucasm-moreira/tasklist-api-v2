import { createBlackList } from 'jwt-blacklist';

class ConfigJwtBlacklist {
  async configJwtBlacklist() {
  // memory
  /*const blacklist = await createBlackList({
    daySize: 10000, // optional, number of tokens need revoking each day
    errorRate: 0.001, // optional, error rate each day
  });*/

    // redis
    const blacklist = await createBlackList({
      daySize: 10000, // optional, number of tokens need revoking each day
      errorRate: 0.001, // optional, error rate each day
      storeType: 'redis', // store type
      redisOptions: {
        host: 'localhost',
        port: 6379,
        key: 'jwt-blacklist', // optional: redis key prefix
      }, // optional, redis options
    });

    return blacklist;
  }
}

export default new ConfigJwtBlacklist();
