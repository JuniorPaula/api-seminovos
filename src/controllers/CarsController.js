import Car from '../models/Car';
import getToken from '../utils/get-token';
import { getUserByToken } from '../utils/get-user-by-token';
import ObjectId from 'mongoose';

class CarsController {
  /** método responsável por listar todos os carros */
  async index(req, res) {
    const cars = await Car.find().sort('-createdAt');
    return res.status(200).json(cars);
  }

  /** método responsável por listar todos os carros
   * pertencente ao usuario */
  async getAllUserCar(req, res) {
    /** recuperar o usuário pelo token */
    const token = getToken(req);
    const user = await getUserByToken(token);

    const cars = await Car.find({ 'user._id': user._id }).sort('createdAt');
    return res.status(200).json(cars);
  }

  /** método responsável por listar todos os carros que o usuário
   * deseja comprar
   */
  async getAllUserBuyer(req, res) {
    /** recuperar o usuário pelo token */
    const token = getToken(req);
    const user = await getUserByToken(token);

    const cars = await Car.find({ 'buyer._id': user._id }).sort('createdAt');
    return res.status(200).json(cars);
  }

  /** método responsável por listar um carro pelo id */
  async show(req, res) {
    const { id } = req.params;

    /** verificar se o id é valido */
    if (!ObjectId.Types.ObjectId.isValid(id))
      return res.status(422).json({ message: 'Invalid ID!' });

    /** verificar se o carro existe */
    const car = await Car.findOne({ _id: id });
    if (!car) return res.status(404).json({ message: 'car not found!' });

    return res.status(200).json(car);
  }

  /** método responsável por criar um carro */
  async create(req, res) {
    const { model, brand, color, description, km, year, price } = req.body;
    const images = req.files;
    const available = true;

    /** validações */
    if (!model) return res.status(422).json({ message: 'Model is required!' });
    if (!brand) return res.status(422).json({ message: 'Brand is required!' });
    if (!color) return res.status(422).json({ message: 'Color is required!' });
    if (!description)
      return res.status(422).json({ message: 'Description is required!' });

    if (!km) return res.status(422).json({ message: 'KM is required!' });
    if (!year) return res.status(422).json({ message: 'Year is required!' });
    if (!price) return res.status(422).json({ message: 'Price is required!' });
    if (images.length === 0) {
      return res.status(422).json({ message: 'Images is required!' });
    }

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

    images.map((image) => car.images.push(image.filename));

    try {
      const newCar = await car.save();
      return res
        .status(201)
        .json({ message: 'Car successfully created', newCar });
    } catch (err) {
      return res.status(500).json({ message: 'Internal server error!' });
    }
  }

  /** método responsável por atualizar um carro */
  async update(req, res) {
    const { id } = req.params;
    const { model, brand, color, description, km, year, price } = req.body;
    const images = req.files;

    const updatedData = {};

    /** verificar se o carro existe */
    const car = await Car.findOne({ _id: id });
    if (!car) return res.status(404).json({ message: 'car not found!' });

    /** veriricar se o usuário registrou o carro */
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (car.user._id.toString() !== user._id.toString()) {
      return res.status(422).json({
        message:
          'There was a problem with your request, please try again later!',
      });
    }

    /** validações */
    if (!model) return res.status(422).json({ message: 'Model is required!' });
    updatedData.model = model;

    if (!brand) return res.status(422).json({ message: 'Brand is required!' });
    updatedData.brand = brand;

    if (!color) return res.status(422).json({ message: 'Color is required!' });
    updatedData.color = color;

    if (!description)
      return res.status(422).json({ message: 'Description is required!' });
    updatedData.description = description;

    if (!km) return res.status(422).json({ message: 'KM is required!' });
    updatedData.km = km;

    if (!year) return res.status(422).json({ message: 'Year is required!' });
    updatedData.year = year;

    if (!price) return res.status(422).json({ message: 'Price is required!' });
    updatedData.price = price;

    if (images.length > 0) {
      updatedData.images = [];
      images.map((image) => updatedData.images.push(image.filename));
    }

    await Car.findByIdAndUpdate(id, updatedData);

    return res.status(200).json({ message: 'Successfully updated car' });
  }

  /** método responsável por deletar um carro */
  async remove(req, res) {
    const { id } = req.params;

    /** verificar se o id é valido */
    if (!ObjectId.Types.ObjectId.isValid(id))
      return res.status(422).json({ message: 'Invalid ID!' });

    /** verificar se o carro existe */
    const car = await Car.findOne({ _id: id });
    if (!car) return res.status(404).json({ message: 'car not found!' });

    /** veriricar se o usuário registrou o carro */
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (car.user._id.toString() !== user._id.toString()) {
      return res.status(422).json({
        message:
          'There was a problem with your request, please try again later!',
      });
    }

    await Car.findByIdAndRemove(id);
    return res.status(200).json({ message: 'Successfully deleted car' });
  }

  /** método responsável por agenda visita de compra */
  async schedule(req, res) {
    const { id } = req.params;

    /** verificar se o carro existe */
    const car = await Car.findOne({ _id: id });
    if (!car) return res.status(404).json({ message: 'car not found!' });

    /** veriricar se o usuário registrou o carro */
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (car.user._id.equals(user._id)) {
      return res.status(422).json({
        message: 'You cannot schedule a visit for your own car!',
      });
    }

    /** verificar se o usuário ja agendou uma visita */
    if (car.buyer) {
      if (car.buyer._id.equals(user._id)) {
        return res.status(422).json({
          message: 'You have already scheduled a visit!',
        });
      }
    }

    car.buyer = {
      _id: user._id,
      name: user.name,
      image: user.image,
    };

    await Car.findByIdAndUpdate(id, car);
    return res.status(200).json({
      message: `You have scheduled a visit to the car: ${car.model} ${car.brand}`,
    });
  }

  /** método responsável por concluir uma venda */
  async concludeBuyer(req, res) {
    const { id } = req.params;

    /** verificar se o carro existe */
    const car = await Car.findOne({ _id: id });
    if (!car) return res.status(404).json({ message: 'car not found!' });

    /** veriricar se o usuário registrou o carro */
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (car.user._id.toString() !== user._id.toString()) {
      return res.status(422).json({
        message:
          'There was a problem with your request, please try again later!',
      });
    }

    car.available = false;

    await Car.findByIdAndUpdate(id, car);

    return res
      .status(200)
      .json({ message: 'congratulations, you complete the sale!' });
  }
}

export default new CarsController();
