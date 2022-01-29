import jwt from 'jsonwebtoken';
import getToken from '../utils/get-token';

export const verifyToken = (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(401).json({ message: 'Access denied' });

  const token = getToken(req);

  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token!' });
  }
};
