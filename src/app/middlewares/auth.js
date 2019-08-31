import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const headerAuthorization = req.headers.authorization;

  if (!headerAuthorization)
    return res.status(401).json({ error: 'Token not provided' });

  const [, token] = headerAuthorization.split(' ');

  try {
    const decodedUserInfo = await promisify(jwt.verify)(
      token,
      authConfig.secret
    );

    req.userId = decodedUserInfo.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
