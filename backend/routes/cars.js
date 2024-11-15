const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the car
 *         description:
 *           type: string
 *           description: The car description
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Tags for the car
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Images of the car
 */

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: List all cars
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword for cars
 *       - in: query
 *         name: myCarsOnly
 *         schema:
 *           type: boolean
 *         description: Fetch only the cars of the authenticated user
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 *       400:
 *         description: Error message
 */
router.get('/', auth, async (req, res) => {
  try {
    const { search, myCarsOnly, page = 1, limit = 10 } = req.query;
    const query = {};

    if (myCarsOnly === 'true') {
      query.userId = req.user.id;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const cars = await Car.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await Car.countDocuments(query);

    res.status(200).json({ cars, totalPages: Math.ceil(totalCount / limit) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Create a new car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files.map((file) => file.path);

    const car = new Car({
      userId: req.user.id,
      title,
      description,
      tags: tags.split(','),
      images,
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Get details of a specific car
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car ID
 *     responses:
 *       200:
 *         description: Car details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       404:
 *         description: Car not found
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, userId: req.user.id });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Update a car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       400:
 *         description: Validation error
 */
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    let images = [];
    if (req.files) {
      images = req.files.map((file) => file.path);
    }

    const updateData = { title, description, tags: tags.split(','), $push: { images } };
    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    );

    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Delete a car
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The car ID
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
