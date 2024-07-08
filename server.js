import express from 'express';
import { readFile, writeFile } from 'fs';
import { join } from 'path';
import { json } from 'body-parser';
const app = express();
const PORT = 3001;

app.use(json());

const productosFilePath = join(__dirname, 'productos.json');

app.get('/productos', (req, res) => {
  readFile(productosFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading productos.json:', err);
      return res.status(500).send('Error reading productos.json');
    }
    try {
      const productos = JSON.parse(data);
      res.json(productos.productos);
    } catch (parseErr) {
      console.error('Error parsing productos.json:', parseErr);
      res.status(500).send('Error parsing productos.json');
    }
  });
});

app.post('/productos', (req, res) => {
  readFile(productosFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading productos.json:', err);
      return res.status(500).send('Error reading productos.json');
    }
    try {
      const productos = JSON.parse(data);
      const nuevoProducto = req.body;
      nuevoProducto.id = productos.productos.length
        ? productos.productos[productos.productos.length - 1].id + 1
        : 1;
      productos.productos.push(nuevoProducto);

      writeFile(productosFilePath, JSON.stringify(productos, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing to productos.json:', writeErr);
          return res.status(500).send('Error writing to productos.json');
        }
        res.status(201).json(nuevoProducto);
      });
    } catch (parseErr) {
      console.error('Error parsing productos.json:', parseErr);
      res.status(500).send('Error parsing productos.json');
    }
  });
});

app.delete('/productos/:id', (req, res) => {
  readFile(productosFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading productos.json:', err);
      return res.status(500).send('Error reading productos.json');
    }
    try {
      const productos = JSON.parse(data);
      const productoId = parseInt(req.params.id, 10);
      const productoIndex = productos.productos.findIndex((p) => p.id === productoId);

      if (productoIndex === -1) {
        return res.status(404).send('Producto no encontrado');
      }

      productos.productos.splice(productoIndex, 1);

      writeFile(productosFilePath, JSON.stringify(productos, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing to productos.json:', writeErr);
          return res.status(500).send('Error writing to productos.json');
        }
        res.status(204).send();
      });
    } catch (parseErr) {
      console.error('Error parsing productos.json:', parseErr);
      res.status(500).send('Error parsing productos.json');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
