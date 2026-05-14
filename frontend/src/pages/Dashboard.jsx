import { useEffect, useState } from 'react';

import API from '../services/api';

import { useNavigate } from 'react-router-dom';

function Dashboard() {

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] =
    useState({
      title: '',
      description: '',
    });


  // FETCH TASKS
  const fetchTasks = async () => {
    try {

      const res = await API.get('/tasks');

      setTasks(res.data);

    } catch (error) {

      console.log(error);

      alert('Failed to fetch tasks');
    }
  };


  useEffect(() => {

    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    fetchTasks();

  }, []);



  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  // CREATE TASK
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await API.post('/tasks', formData);

      setFormData({
        title: '',
        description: '',
      });

      fetchTasks();

    } catch (error) {

      alert('Failed to create task');
    }
  };



  // DELETE TASK
  const deleteTask = async (id) => {
    try {

      await API.delete(`/tasks/${id}`);

      fetchTasks();

    } catch (error) {

      alert('Delete failed');
    }
  };



  // LOGOUT
  const logout = () => {

    localStorage.removeItem('token');

    navigate('/');
  };

const toggleComplete = async (task) => {

  try {

    await API.put(
      `/tasks/${task._id}`,
      {
        completed: !task.completed,
      }
    );

    fetchTasks();

  } catch (error) {

    alert('Update failed');
  }
};
  return (
   <div className='container'>
      <h1>Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>


      <hr />


      <h2>Create Task</h2>

      <form onSubmit={handleSubmit}>

        <input
          type='text'
          name='title'
          placeholder='Task Title'
          value={formData.title}
          onChange={handleChange}
        />

        <br /><br />

        <textarea
          name='description'
          placeholder='Description'
          value={formData.description}
          onChange={handleChange}
        />

        <br /><br />

        <button type='submit'>
          Add Task
        </button>

      </form>


      <hr />


      <h2>Your Tasks</h2>

      {
        tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          tasks.map((task) => (

            <div
              key={task._id}
              className='task-card'
            >

              <h3>{task.title}</h3>

              <p>{task.description}</p>

              <p>
                Status:
                {
                  task.completed
                    ? ' Completed'
                    : ' Pending'
                }
              </p>

              <button
                onClick={() =>
                  deleteTask(task._id)
                }
              >
                Delete
              </button>
<button
  onClick={() =>
    toggleComplete(task)
  }
>
  Toggle Status
</button>
            </div>
          ))
        )
      }

    </div>
  );
}

export default Dashboard;