
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { pool, createTable, insertPost } = require('./config/config');
const port = 3000;

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


createTable();

// rutas
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener posts' });
    }
});

app.post('/posts', async (req, res) => {
    const { titulo, url, descripcion } = req.body;
    try {
        await insertPost(titulo, url, descripcion);
        res.status(201).json({ message: 'Post creado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el post' });
    }
});

// archivos html
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// maneja rutas no definidas por API y servir el index.html del front
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html')); 
});


app.listen(port, () => {
    console.log(`Servidor levantado en http://localhost:${port}`);
});
