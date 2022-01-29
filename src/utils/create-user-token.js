import jwt from 'jsonwebtoken';

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    process.env.TOKEN_SECRET,
  );

  res.status(200).json({
    message: 'successfully authenticated',
    token: token,
    userId: user._id,
  });
};

export default createUserToken;
