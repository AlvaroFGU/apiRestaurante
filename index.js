import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.log(error);
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
  res.json(restaurant);
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
  data.restaurants[restaurantIndex] = {
    ...data.restaurants[restaurantIndex],
    ...body,
  };
  writeData(data);
  res.json({ message: "Restaurant updated successfully" });
});

app.delete("/restaurants/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const restaurantIndex = data.restaurants.findIndex((restaurant) => restaurant.id === id);
  data.restaurants.splice(restaurantIndex, 1);
  writeData(data);
  res.json({ message: "Restaurant deleted successfully" });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
