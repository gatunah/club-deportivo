const express = require("express");
const axios = require("axios");
const path = require("path");
const { isUtf8 } = require("buffer");
// const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const app = express();
// const Jimp = require("jimp");
const port = 3002;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//ESTATICOS
app.use(express.static("public"));
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));
app.use("/axios", express.static(__dirname + "/node_modules/axios/dist"));

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/agregar", async (req, res) => {
  try {
    const { nombre, precio } = req.query;
    const deporte = { nombre, precio };
    let data = { deportes: [] }; //INICIA COMO ARREGLO

    try {
      //LEE EL ARCHIVO
      const contentJson = await fs.readFile("deportes.json", "utf-8");
      data = JSON.parse(contentJson); //SOBRESCRIBE
    } catch (err) {
      //NO LO LOGRA LEER
      console.error("Error al leer el archivo", err); //SI NO EXISTE DATA SIGUE SIENDO UN ARREGLO
    }

    data.deportes.push(deporte);

    await fs.writeFile("deportes.json", JSON.stringify(data));

    res.status(200).json({ success: true });
  } catch (e) {
    console.error("Error al escribir el archivo", e);
    res
      .status(500)
      .json({ success: false, message: "Error al escribir el archivo" });
  }
});
app.get("/deportes", async (req, res) => {
  try {
    const contentJson = await fs.readFile("deportes.json", "utf-8");
    let data = JSON.parse(contentJson);
    res.status(200).json(data);
  } catch (e) {
    console.error("Error al leer el archivo", e);
    res
      .status(500)
      .json({ success: false, message: "Error al leer el archivo" });
  }
});

app.get("/eliminar", async (req, res) => {
  try {
    const { nombre } = req.query;
    const contentJson = await fs.readFile("deportes.json", "utf-8");
    let data = JSON.parse(contentJson);

    const index = data.deportes.findIndex(
      (deporte) => deporte.nombre === nombre
    );

    if (index !== -1) {
      data.deportes.splice(index, 1);//SE ELIMINA SOLO  1 ELEMENTO array.splice(start, deleteCount, item1, item2, ...);
      await fs.writeFile("deportes.json", JSON.stringify(data));

      res.status(200).json({ success: true, message: "Deporte eliminado" });
    } else {
      res.status(404).json({ success: false, message: "Deporte no encontrado" });//SE INGRESA VALOR NO COINCIDENTE - NOT FOUND
    }
  } catch (e) {
    res.status(500).json({ success: false, message: "Error al leer o escribir el archivo" });
  }
});
app.get('/editar', async (req, res) => {
  try {
    const { nombre, precio } = req.query;
    const contentJson = await fs.readFile('deportes.json', 'utf-8');
    let data = JSON.parse(contentJson);

    const index = data.deportes.findIndex(deporte => deporte.nombre === nombre);

    if (index !== -1) {
      data.deportes[index].precio = precio;
      await fs.writeFile('deportes.json', JSON.stringify(data));
      res.status(200).json({ success: true, message: 'Deporte actualizado' });
    } else {
      res.status(404).json({ success: false, message: 'Deporte no encontrado' });
    }
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error al leer o escribir el archivo' });
  }
});