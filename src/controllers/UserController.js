import bcryptjs from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import createUserToken from '../utils/create-user-token';
import getToken from '../utils/get-token';

class UserController {
  /** método responsável por registrar um usuário */
  async register(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    /** verificar o que vem do body */
    if (!name) return res.status(422).json({ message: 'Name is riquired!' });
    if (!email) return res.status(422).json({ message: 'Email is riquired!' });
    if (!validator.isEmail(email))
      return res.status(422).json({ message: 'Email invalid!' });

    if (!password)
      return res.status(422).json({ message: 'Password is riquired!' });

    if (!confirmPassword)
      return res.status(422).json({ message: 'Confirm password is riquired!' });

    if (password !== confirmPassword)
      return res.status(422).json({ message: 'Passwords must be the same!' });

    /** verificar se o usuário existe */
    const userExists = await User.findOne({ email });
    if (userExists)
      return res
        .status(422)
        .json({ message: 'email already registered, please use another!' });

    /** criptografar a senha */
    const salt = await bcryptjs.genSalt(12);
    const passwordHashed = await bcryptjs.hash(password, salt);

    const user = new User({
      name,
      email,
      password: passwordHashed,
    });

    try {
      const newUser = await user.save();

      await createUserToken(newUser, req, res);
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  /** método responsável por logar o usuário */
  async login(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(422).json({ message: 'Email is riquired!' });
    if (!validator.isEmail(email))
      return res.status(422).json({ message: 'Email invalid!' });

    if (!password)
      return res.status(422).json({ message: 'Password is riquired!' });

    /** verificar se o usuário existe */
    const user = await User.findOne({ email });
    if (!user) return res.status(422).json({ message: 'User not found!' });

    /** verificar se a senha confere com a do banco */
    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword)
      return res.status(422).json({ message: 'Invalid password!' });
  }

  /** método responsável por resgatar o token to usuário */
  async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      currentUser = await User.findById(decoded.id);
      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    return res.status(200).send(currentUser);
  }
}

export default new UserController();
