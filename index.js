import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error.message);
    return { restaurants: [] }; // Devuelve un array vacío si hay un error
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing JSON file:", error.message);
  }
};

app.get("/", (req, res) => {
  res.send("Welcome to my restaurant API with Node.js!");
});

app.get("/restaurants", (req, res) => {
  const data = readData();
  res.json(data.restaurants);
});

app.get("/restaurants/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const restaurant = data.restaurants.find((restaurant) => restaurant.id === id);
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ message: "Restaurant not found" });
  }
});

app.post("/restaurants", (req, res) => {
  const data = readData();
  const body = req.body;
  const newRestaurant = {
    id: data.restaurants.length + 1,
    ...body,
  };
  data.restaurants.push(newRestaurant);
  writeData(data);
  res.json(newRestaurant);
});

app.put("/restaurants/:id", (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const restaurantIndex = data.restaurants.findIndex((restaurant) => restaurant.id === id);
  if (restaurantIndex !== -1) {
    data.restaurants[restaurantIndex] = {
      ...data.restaurants[restaurantIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "Restaurant updated successfully" });
  } else {
    res.status(404).json({ message: "Restaurant not found" });
  }
});

app.put("/restaurants/:id/plato", (req, res) => {
  const data = readData();
  const restaurantId = parseInt(req.params.id);
  const restaurant = data.restaurants.find((restaurant) => restaurant.id === restaurantId);

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  const { nombre, nuevoPrecio, nuevaDescripcion, nuevasPorciones } = req.body;

  const plato = restaurant.platos.find((plato) => plato.nombre === nombre);
  if (!plato) {
    return res.status(404).json({ message: "Plato not found" });
  }

  if (nuevoPrecio) plato.precio = nuevoPrecio;
  if (nuevaDescripcion) plato.descripcion = nuevaDescripcion;
  if (nuevasPorciones) plato.porciones = nuevasPorciones;

  writeData(data);
  res.json({ message: "Plato updated successfully", plato });
});

app.put("/restaurants/:id/platos/:platoId", (req, res) => {
  const data = readData();
  const restaurantId = parseInt(req.params.id);
  const platoId = parseInt(req.params.platoId);
  const restaurant = data.restaurants.find((r) => r.id === restaurantId);

  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }

  const dishIndex = restaurant.platos.findIndex((plato) => plato.id === platoId);

  if (dishIndex === -1) {
    return res.status(404).json({ message: "Dish not found" });
  }

  // Update the dish
  restaurant.platos[dishIndex] = {
    ...restaurant.platos[dishIndex],
    ...req.body,
  };

  writeData(data);

  res.json(restaurant.platos[dishIndex]);
});

app.delete("/restaurants/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const restaurantIndex = data.restaurants.findIndex((restaurant) => restaurant.id === id);
  if (restaurantIndex !== -1) {
    data.restaurants.splice(restaurantIndex, 1);
    writeData(data);
    res.json({ message: "Restaurant deleted successfully" });
  } else {
    res.status(404).json({ message: "Restaurant not found" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
