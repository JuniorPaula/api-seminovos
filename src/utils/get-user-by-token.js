import jwt from 'jsonwebtoken';
import User from '../models/User';

export const getUserByToken = async (token) => {
  // eslint-disable-next-line no-undef
  if (!token) return res.status(401).json({ message: 'Access denied' });

  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return user;
};
