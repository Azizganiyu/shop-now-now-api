import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
  /**
   * Sets a value in the cache with the specified key.
   *
   * @param {string} key The key to set the value with.
   * @param {any} value The value to be stored in the cache.
   */
  async set(key: string, value: any) {
    await this.cache.set(key, value);
  }

  /**
   * Retrieves a value from the cache using the specified key.
   *
   * @param {string} key The key to retrieve the value.
   * @returns {Promise<any>} A promise that resolves with the retrieved value from the cache.
   */
  async get(key: string) {
    return await this.cache.get(key);
  }
}
