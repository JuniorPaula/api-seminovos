import bcryptjs from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import createUserToken from '../utils/create-user-token';
import getToken from '../utils/get-token';
import { getUserByToken } from '../utils/get-user-by-token';

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

    await createUserToken(user, req, res);
  }

  /** método responsável por listar um usuário por ID */
  async show(req, res) {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) return res.status(422).json({ message: 'User not found!' });

    return res.status(200).json(user);
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

  /** método responsável por editar um usuário */
  async update(req, res) {
    //const id = req.params.id;

    /** verificar o usuário pelo token */
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, password, confirmPassword } = req.body;

    /** upload de imagem do usuário */

    if (req.file) {
      user.image = req.file.filename;
    }

    /** verificar o que vem do body */
    if (!name) return res.status(422).json({ message: 'Name is riquired!' });
    user.name = name;

    if (!email) return res.status(422).json({ message: 'Email is riquired!' });
    if (!validator.isEmail(email))
      return res.status(422).json({ message: 'Email invalid!' });

    /** verificar se o email ja está sendo usado */
    const userExist = await User.findOne({ email: email });
    if (user.email !== email && userExist) {
      return res.status(422).json({ message: 'Please, user another email!' });
    }

    user.email = email;

    if (password !== confirmPassword) {
      return res.status(422).json({ message: 'Passwords must be the same!' });
    } else if (password === confirmPassword && password != null) {
      /** criptografar a senha */
      const salt = await bcryptjs.genSalt(12);
      const reqPassword = req.body.password;

      const passwordHashed = await bcryptjs.hash(reqPassword, salt);

      user.password = passwordHashed;
    }

    try {
      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true },
      );

      return res
        .status(200)
        .json({ message: 'User successfully updated', user });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new UserController();
