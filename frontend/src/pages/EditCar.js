// frontend/src/pages/EditCar.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../services/api';

const EditCar = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState({
    car_type: '',
    company: '',
    dealer: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCar = async () => {
    try {
      const res = await axios.get(`/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setTitle(res.data.title);
      setDescription(res.data.description);
      setTags(res.data.tags);
    } catch (err) {
      setError('Failed to fetch car details');
    }
  };

  useEffect(() => {
    fetchCar();
    // eslint-disable-next-line
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files.length > 10) {
      setError('You can upload up to 10 images');
      return;
    }
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags));
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      await axios.put(`/api/cars/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getToken()}`,
        },
      });
      navigate(`/cars/${id}`);
    } catch (err) {
      setError(err.response.data.message || 'Failed to update car');
    }
  };

  return (
    <div className="edit-car-container">
      <h2>Edit Car</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>Tags:</label>
          <input
            type="text"
            placeholder="Car Type"
            value={tags.car_type}
            onChange={(e) => setTags({ ...tags, car_type: e.target.value })}
          />
          <input
            type="text"
            placeholder="Company"
            value={tags.company}
            onChange={(e) => setTags({ ...tags, company: e.target.value })}
          />
          <input
            type="text"
            placeholder="Dealer"
            value={tags.dealer}
            onChange={(e) => setTags({ ...tags, dealer: e.target.value })}
          />
        </div>
        <div>
          <label>Images (up to 10):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Update Car</button>
      </form>
    </div>
  );
};

export default EditCar;
