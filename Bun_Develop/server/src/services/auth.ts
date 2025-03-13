// import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql'

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = ({ req }: { req: any}) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';

    const data = jwt.verify(token, secretKey);

    req.user = data as JwtPayload;
    return req;

    // jwt.verify(token, secretKey, (err: any, user: any) => {

    //   if (err) {
    //     // return res.sendStatus(403); // Forbidden

    //     return req;
    //   }
    //   req.user = user as JwtPayload;
    //   return req;
    //   // return next();
    // });
  } else {
    // res.sendStatus(401); // Unauthorized
    console.log("No token!")
    return req;
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export class authenticateError extends GraphQLError {
  constructor(message:string) {
    super(message,undefined,undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError'});
  }
};
