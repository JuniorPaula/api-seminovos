class CarsController {
  /** método responsável por criar um carro */
  async create(req, res) {
    return res.send('hello cars');
  }
}

export default new CarsController();
