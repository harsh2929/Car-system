// backend/models/Car.js

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); // Ensure this line is present

const CarSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    images:      [{ type: String }], // Array of image URLs
    tags:        [{ type: String }],
  },
  { timestamps: true }
);

// Apply the pagination plugin to the schema
CarSchema.plugin(mongoosePaginate); // Ensure this line is present

module.exports = mongoose.model('Car', CarSchema);

