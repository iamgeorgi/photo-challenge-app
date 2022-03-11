import express from 'express';
import usersService from '../services/users-service.js';
import usersData from '../data/users-data.js';
import serviceErrors from '../services/service-errors.js';
import { createValidator, createUserSchema, updateUserSchema } from '../validators/allSchemas.js';
import { authMiddleware } from '../auth/auth-middleware.js';
import { roleMiddleware } from '../auth/auth-middleware.js';

const usersController = express.Router();


usersController
  .get('/',
    authMiddleware,
    roleMiddleware('Organizer'),
    async (req, res) => {

      const { users, error } = await usersService.getAllPhotoJunkies(usersData)();

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        return res.status(404).json({ message: 'Users data not found!' });
      }

      return res.status(200).send(users);
    })
  // get user by id
  .get('/:id',
    async (req, res) => {

      const { id } = req.params;
      const result = await usersService.getUserById(usersData)(+id);
      const { error, user } = result;

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'User not found!' });
      } else if (error === serviceErrors.OPERATION_NOT_PERMITTED) {

        res.status(404).send({ message: 'Invalid url params!' });
      } else {

        res.status(200).send(user);
      }
    },
  )
  // create new user
  .post('/',
    createValidator(createUserSchema),
    async (req, res) => {

      const createData = req.body;
      const { error, user } = await usersService.createUser(usersData)(createData);

      if (error === serviceErrors.DUPLICATE_RECORD) {

        res.status(409).send({ message: 'Username not available' });
      } else {

        res.status(201).send(user);
      }
    })
  // update user
  .put('/:id',
    createValidator(updateUserSchema),
    async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;

      const { error, user } = await usersService.updateUser(usersData)(+id, updateData);

      if (error === serviceErrors.RECORD_NOT_FOUND) {

        res.status(404).send({ message: 'User not found!' });
      } else if (error === serviceErrors.DUPLICATE_RECORD) {

        res.status(409).send({ message: 'Name not available' });
      } else {

        res.status(200).send(user);
      }
    });


export default usersController;