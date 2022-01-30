import Car from '../models/Car';
import getToken from '../utils/get-token';
import { getUserByToken } from '../utils/get-user-by-token';

class CarsController {
  /** método responsável por criar um carro */
  async create(req, res) {
    const { model, brand, color, description, km, year, price } = req.body;
    const available = true;

    /** uploads de images dos carros */

    /** validações */
    if (!model) return res.status(422).json({ message: 'Model is required!' });
    if (!brand) return res.status(422).json({ message: 'Brand is required!' });
    if (!color) return res.status(422).json({ message: 'Color is required!' });
    if (!description)
      return res.status(422).json({ message: 'Description is required!' });

    if (!km) return res.status(422).json({ message: 'KM is required!' });
    if (!year) return res.status(422).json({ message: 'Year is required!' });
    if (!price) return res.status(422).json({ message: 'Price is required!' });

    /** recuperar o usuário dono do carro pelo token */
    const token = getToken(req);
    const user = await getUserByToken(token);

    /** criar objeto com novo carro */
    const car = new Car({
      model,
      brand,
      color,
      description,
      km,
      year,
      price,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
      },
    });

    try {
      const newCar = await car.save();
      return res
        .status(201)
        .json({ message: 'Car successfully created', newCar });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error!' });
    }
  }
}

export default new CarsController();
