const errorHandler =
    require('./middleware/errorMiddleware');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const swaggerUi = require('swagger-ui-express');

const swaggerSpec =
    require('./config/swagger');
const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);


app.get('/', (req, res) => {
    res.send('API Running');
});

app.use(errorHandler);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);
module.exports = app;