const getToken = (req) => {
  const { authorization } = req.headers;

  const token = authorization.split(' ')[1];

  return token;
};

export default getToken;
