import bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { env } from '../../config/env';

export class PasswordService {
  static async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export class JwtService {
  static generateAccessToken(payload: Record<string, unknown>): string {
    return jsonwebtoken.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jsonwebtoken.SignOptions['expiresIn'],
    });
  }

  static generateRefreshToken(payload: Record<string, unknown>): string {
    return jsonwebtoken.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as jsonwebtoken.SignOptions['expiresIn'],
    });
  }

  static verifyAccessToken(token: string): string | jsonwebtoken.JwtPayload {
    return jsonwebtoken.verify(token, env.JWT_ACCESS_SECRET);
  }

  static verifyRefreshToken(token: string): string | jsonwebtoken.JwtPayload {
    return jsonwebtoken.verify(token, env.JWT_REFRESH_SECRET);
  }
}
