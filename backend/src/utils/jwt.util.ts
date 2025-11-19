import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  email: string;
}

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is not defined`);
  }
  return value;
};

const getJwtSecret = (): Secret => getEnvVar('JWT_SECRET');
const getRefreshSecret = (): Secret => getEnvVar('JWT_REFRESH_SECRET');

export const generateAccessToken = (
  payload: TokenPayload,
  options: SignOptions = {},
): string => {
  const signOptions: SignOptions = {
    ...options,
    expiresIn: (process.env.JWT_EXPIRE ?? '15m') as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, getJwtSecret(), signOptions);
};

export const generateRefreshToken = (
  payload: TokenPayload,
  options: SignOptions = {},
): string => {
  const signOptions: SignOptions = {
    ...options,
    expiresIn: (process.env.JWT_REFRESH_EXPIRE ?? '7d') as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, getRefreshSecret(), signOptions);
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, getJwtSecret()) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, getRefreshSecret()) as TokenPayload;
};
