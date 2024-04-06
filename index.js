const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.static("public"));
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
    try {
        res.sendFile("index.html");
    } catch (error) {
        console.error("Hubo un error", error.message);
        res.status(500).send(error.message);
    }
});

// Ruta para agregar un nuevo deporte
app.get("/agregar", async (req, res) => {
  try {
      let { nombre, precio } = req.query;
      nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();
      const deporte = {
          nombre,
          precio,
          id: uuidv4().slice(0, 6),
      };
      const archivo = fs.readFileSync("deportes.json", "utf8");
      const data = await JSON.parse(archivo);
      const deportes = data.deportes;
      deportes.unshift(deporte);
      fs.writeFileSync("deportes.json", JSON.stringify(data));

      res.send("Deporte almacenado con éxito");
  } catch (error) {
      console.error("Hubo un error", error.message);
      res.status(500).send(error.message);
  }
});



// Ruta para obtener todos los deportes registrados
app.get("/deportes", async (req, res) => {
    try {
        fs.readFile("deportes.json", (err, data) => {
            res.send(data);
        });
    } catch (error) {
        console.error("Hubo un error", error.message);
        res.status(500).send(error.message);
    }
});

// Ruta para editar el precio de un deporte
app.get("/editar", (req, res) => {
    try {
        const { id, precio } = req.query;
        const archivo = fs.readFileSync("deportes.json", "utf-8");
        const data = JSON.parse(archivo);
        let { deportes } = data;

        // Buscar el deporte por su id
        deportes = deportes.map((deporte) => {
            if (deporte.id === id) {
                deporte.precio = precio;
                return deporte;
            }
            return deporte;
        });
        // Escribir el archivo JSON actualizado
        fs.writeFileSync("deportes.json", JSON.stringify({ deportes }));

        res.send(`Precio modificado a ${precio}`);
    } catch (error) {
        console.error("Hubo un error", error.message);
        res.status(500).send(error.message);
    }
});

// Ruta para eliminar un deporte
app.get("/eliminar", (req, res) => {
    try {
        const { nombre, precio, id } = req.query;
        const archivo = fs.readFileSync("deportes.json", "utf-8");
        const data = JSON.parse(archivo);
        let { deportes } = data;
        const deporteIndex = deportes.findIndex((deporte) => deporte.id === id);

        if (deporteIndex !== -1) {
            // Eliminar el deporte del arreglo de deportes
            deportes.splice(deporteIndex, 1);
            // Escribir el archivo JSON actualizado
            fs.writeFileSync("deportes.json", JSON.stringify(data));
            // Enviar una respuesta al cliente
            res.send(
                `Deporte ${
                nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase()
                } con precio ${precio} ha sido Eliminado Correctamente`
            );
        } else {
            // Si el deporte no se encuentra, responder con un código de estado 404
            res.status(404).send("ID no encontrado");
        }
    } catch (error) {
        console.error("Hubo un error", error.message);
        res.status(500).send(error.message);
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT}`);
});


