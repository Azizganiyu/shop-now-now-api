import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import fs = require('fs');
import { join } from 'path';
import { promisify } from 'util';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import * as trigramSimilarity from 'trigram-similarity';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class HelperService {
  constructor(private readonly _config: ConfigService) {}

  /**
   * Generates a random string of specified minimum length.
   *
   * @param {number} [minLength=6] The minimum length of the generated string.
   * @param {string} [acc=''] The accumulator string (used for recursive concatenation).
   * @returns {string} The randomly generated string.
   */
  generateRandomString(minLength = 6, acc = ''): any {
    if (acc.length <= minLength) {
      const str = Math.random().toString(36).slice(2);
      return this.generateRandomString(minLength, acc.concat(str));
    }

    return acc.slice(0, minLength).toUpperCase();
  }

  /**
   * Generates a random code with the specified length.
   *
   * @param {number} [length=5] The length of the code to generate.
   * @returns {string} The randomly generated code.
   */
  generateCode(length = 6) {
    const random = Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1),
    );
    return String(random);
  }

  /**
   * Sets the date to a future time by adding the specified number of seconds to the current date.
   *
   * @param {number} seconds The number of seconds to add to the current date.
   * @returns {Date} The date set to the future time.
   */
  setDateFuture(seconds) {
    const time = new Date();
    time.setSeconds(time.getSeconds() + parseInt(seconds));
    return time;
  }

  /**
   * Checks if a given date is expired.
   *
   * @param {Date | string} date The date to check for expiration.
   * @returns {boolean} A boolean value indicating whether the date is expired.
   */
  checkExpired(date: Date | string): boolean {
    if (!date) {
      return true;
    }
    const now = new Date();
    const expire = new Date(date);

    if (now.getTime() > expire.getTime()) {
      return true;
    }

    return false;
  }

  /**
   * Calculates the time remaining until a specified end time.
   *
   * @param {Date | string} endtime The end time to calculate the remaining time for.
   * @returns {number[]} An array containing the total milliseconds remaining, followed by days, hours, minutes, and seconds remaining.
   */
  getTimeRemaining(endtime: Date | string) {
    const now = new Date();
    const expire = new Date(endtime);
    const total = expire.getTime() - now.getTime();
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return [total, days, hours, minutes, seconds];
  }

  /**
   * Gets the full name of a user.
   *
   * @param {User} user The user object containing first and last name.
   * @returns {string} The full name of the user.
   */
  getFullName(user: User) {
    if (!user || !user?.firstName || !user?.lastName) {
      return '';
    }
    return `${user.firstName} ${user.lastName}`;
  }

  /**
   * Encrypts the specified text using AES-256 encryption.
   *
   * @param textToEncrypt - The text to be encrypted.
   * @returns The encrypted text.
   */
  async encrypt(textToEncrypt: string) {
    if (!textToEncrypt) {
      return textToEncrypt;
    }
    const password = fs.readFileSync(join(process.cwd(), '.chrdb')).toString();
    const iv = fs.readFileSync(join(process.cwd(), '.chiv')).toString();
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    const encrypted =
      cipher.update(textToEncrypt, 'utf8', 'base64') + cipher.final('base64');
    return Buffer.from(encrypted).toString('base64');
  }

  /**
   * Decrypts the specified text using AES-256 decryption.
   *
   * @param textToDecrypt - The text to be decrypted.
   * @returns The decrypted text.
   */
  async decrypt(textToDecrypt: string) {
    if (!textToDecrypt) {
      return textToDecrypt;
    }
    const iv = fs.readFileSync(join(process.cwd(), '.chiv')).toString();
    const password = fs.readFileSync(join(process.cwd(), '.chrdb')).toString();
    const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
    const buff = Buffer.from(textToDecrypt, 'base64');
    const encrypted = buff.toString('utf-8');
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    return (
      decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8')
    );
  }

  /**
   * Generates a random alphanumeric string of specified length.
   *
   * @param {number} [length=6] The length of the generated string.
   * @param {boolean} [express=false] Indicates whether the string is for express use.
   * @param {string} [transactionType=null] The transaction type to include in the string.
   * @returns {string} The randomly generated alphanumeric string.
   */
  generateRandomAlphaNum(length = 6) {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const valueLength = length;
    let value = '';
    for (let i = 0; i <= valueLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      value += chars.substring(randomNumber, randomNumber + 1);
    }
    return value.toUpperCase();
  }

  /**
   * Checks the similarity between two texts using trigram similarity.
   *
   * @function checkMatch
   * @param {string} text1 - The first text to compare.
   * @param {string} text2 - The second text to compare.
   * @returns {number} The trigram similarity score between the two texts.
   */
  checkMatch(text1: string, text2: string): number {
    return trigramSimilarity(text1, text2);
  }

  /**
   * Removes null properties from an object.
   *
   * @function removeNull
   * @param {any} obj - The object from which null properties are to be removed.
   * @returns {any} The object with null properties removed.
   */
  removeNull(obj: any) {
    for (const key in obj) {
      if (obj[key] === null) {
        delete obj[key];
      }
    }
    return obj;
  }

  /**
   * Verifies a user's two-factor authentication (2FA) code.
   *
   * Checks if the user has 2FA enabled and a valid 2FA secret,
   * then verifies the provided code against the stored secret.
   *
   * @param user - The user object containing 2FA settings.
   * @param code - The authentication code to verify.
   * @returns True if the authentication code is valid; otherwise, throws an error.
   */
  async authenticate2FA(user: User, code: string) {
    // Check if user has 2FA enabled and a secret configured
    if (!user.twoFactorAuthenticationSecret || !user.twoFactorAuthentication) {
      throw new BadRequestException('This user has not enabled 2FA');
    }

    // Verify the provided 2FA code against the stored secret
    const isCodeValid = await this.isTwoFactorAuthenticationCodeValid(
      code,
      user.twoFactorAuthenticationSecret,
    );

    // If code is not valid, throw ForbiddenException
    if (!isCodeValid) {
      throw new ForbiddenException('Wrong authentication code');
    }

    // Return true if code is valid
    return true;
  }

  /**
   * Generates a two-factor authentication secret and OTPAuth URL for the specified email.
   *
   * @param {string} email The email address for which to generate the secret and OTPAuth URL.
   * @returns {Promise<{ secret: string, otpauthUrl: string }>} A promise that resolves with an object containing the generated secret and OTPAuth URL.
   */
  async generateTwoFactorAuthenticationSecret(email: string) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      email,
      this._config.get<string>('auth.twoFactorName'),
      secret,
    );
    return {
      secret,
      otpauthUrl,
    };
  }

  /**
   * Pipes the QR code stream for the provided OTPAuth URL.
   *
   * @param {string} otpauthUrl The OTPAuth URL for generating the QR code.
   * @returns {Promise<string>} A promise that resolves with the data URL of the generated QR code.
   */
  async pipeQrCodeStream(otpauthUrl: string) {
    return await toDataURL(otpauthUrl);
  }

  /**
   * Checks if the provided two-factor authentication code is valid for the given secret.
   *
   * @param {string} token The two-factor authentication code to verify.
   * @param {string} secret The secret used for two-factor authentication.
   * @returns {boolean} A boolean value indicating whether the provided code is valid.
   */
  async isTwoFactorAuthenticationCodeValid(token: string, secret: string) {
    const twofa = JSON.parse(await this.decrypt(secret));
    return authenticator.verify({
      token,
      secret: twofa.secret,
    });
  }

  /**
   * Converts a given text to an ID-friendly format.
   *
   * - Trims whitespace from the beginning and end.
   * - Converts the text to lowercase.
   * - Removes all non-alphanumeric characters except spaces.
   * - Replaces spaces with hyphens.
   *
   * @param {string} text - The input text to be converted.
   * @returns {string} The converted text in ID-friendly format.
   */
  idFromName(text: string): string {
    if (!text) {
      return text;
    }
    return text
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '') // Remove all non-alphanumeric characters except spaces
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
  }
}
