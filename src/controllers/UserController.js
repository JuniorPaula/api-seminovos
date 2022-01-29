import bcryptjs from 'bcryptjs';
import validator from 'validator';
import User from '../models/User';

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

      return res
        .status(201)
        .json({ message: 'user created successfully', newUser });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
}

export default new UserController();
