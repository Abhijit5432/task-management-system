import { Link } from 'react-router-dom';
import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: '',
      email: '',
      password: '',
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await API.post(
        '/auth/register',
        formData
      );

      localStorage.setItem(
        'token',
        res.data.token
      );

      alert('Registered Successfully');

      navigate('/dashboard');

    } catch (error) {

      alert(
        error.response?.data?.message ||
        'Registration failed'
      );
    }
  };

return (
  <div className='container'>

    <h1>Register</h1>

    <form onSubmit={handleSubmit}>

      <input
        type='text'
        name='name'
        placeholder='Name'
        onChange={handleChange}
      />

      <input
        type='email'
        name='email'
        placeholder='Email'
        onChange={handleChange}
      />

      <input
        type='password'
        name='password'
        placeholder='Password'
        onChange={handleChange}
      />

      <button type='submit'>
        Register
      </button>

    </form>

    <p className='link-text'>
      Already have an account?
      <Link to='/'>
        Login
      </Link>
    </p>

  </div>
);
}

export default Register;