class UserController {
  async register(req, res) {
    return res.send('ola mundo!');
  }
}

export default new UserController();
