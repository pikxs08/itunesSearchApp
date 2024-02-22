// Ensure express is required
const express = require("express");
const helmet = require("helmet");
const app = express();
const port = process.env.PORT || 3002;
const compression = require('compression');
app.use(compression());



// Use helmet
app.use(helmet());


// Heroku deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// file reader
const fs = require("fs");

// Ensure body parser is running
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({ msg: "welcome to muneeb's backend" });
});

app.get("/api", (req, res) => {
  fs.readFile("favorites.json", (err, data) => {
    if (err) {
      res.status(500).send("Error getting data");
    } else {
      const jsonData = JSON.parse(data);
      res.send(jsonData);
    }
  });
});

function getFavorites() {
  try {
    const favorites = fs.readFileSync("favorites.json");
    return JSON.parse(favorites);
  } catch (e) {
    // file non-existent
    fs.writeFileSync("favorites.json", "[]");
    return [];
  }
}

function addFavorite(id, title, artistName, img) {
  const favorites = getFavorites();
  favorites.push({
    id: id,
    title: title,
    artistName: artistName,
    img: img,
  });
  fs.writeFileSync("favorites.json", JSON.stringify(favorites));
}

app.post("/post", (req, res) => {
  const favorites = getFavorites();
  const newTitle = req.body.title;
  const newArtistName = req.body.artistName;
  const newImg = req.body.img;

  // Check if the project already exists
  const favoriteExists = favorites.some(
    (favorite) => favorite.title === newTitle
  );

  if (favoriteExists) {
    res.status(200).json({ message: "Favorite already exists" });
  } else {
    addFavorite(favorites.length + 1, newTitle, newArtistName, newImg);
    res.status(200).json({ message: "Favorite added" });
  }
});

app.delete("/delete", (req, res) => {
  const favorites = getFavorites();
  const title = req.body.title;

  const newFavorites = favorites.filter((favorite) => favorite.title !== title);

  fs.writeFileSync("favorites.json", JSON.stringify(newFavorites));
  res.status(200).json({ message: "Favorite deleted" });
});
