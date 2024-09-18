import { Response, Request, NextFunction } from 'express';
import { appEnv } from '../env';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).send('Access Denied / Unauthorized request');

  try {
    token = token.split(' ')[1];

    if (token === 'null' || !token) return res.status(401).send('Unauthorized request');

    const verifiedUser = jwt.verify(token, appEnv.JWT_SECRET);
    if (!verifiedUser) return res.status(401).send('Unauthorized request');

    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(400).send({ error: 'Invalid Token' });
  }
};
