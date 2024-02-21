import React, { useEffect, useState, useRef } from "react";
import { Star, StarFill } from "react-bootstrap-icons";
import FavoritesList from "./Favourites";

function Search() {
  const [search, setSearch] = useState("");
  const [mediaType, setMediaType] = useState("all"); // ["all", "music", "movie", "tvShow"]
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const searchTerm = useRef(null);
  const [favorites, setFavorites] = useState([]);

  //   Initial get request to fetch all favorites
  useEffect(() => {
    if (favorites.length === 0) {
      getFavorites();
    }
  }, [favorites]);

  //   Get all favorites
  async function getFavorites() {
    try {
      const response = await fetch("/api");
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }

  //   Function to fetch search results
  async function fetchResults() {
    try {
      let response = "";
      if (mediaType === "all") {
        response = await fetch(
          `https://itunes.apple.com/search?term=${search}`
        );
      } else {
        response = await fetch(
          `https://itunes.apple.com/search?term=${search}&media=${mediaType}`
        );
      }
      const data = await response.json();

      setResults(data.results);
      console.log(results);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }
  //   Function to add a favourite to list of favourites
  const addFavorite = (id, title, artistName, img) => {
    const favoriteExists = favorites.some(
      (favorite) => favorite.title === title
    );
    if (favoriteExists) {
      alert("Favorite already exists");
    } else {
      fetch("/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id + 1,
          title: title,
          artistName: artistName,
          img: img,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add favorite");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data.message);
          setFavorites([...favorites, data]);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  //   Function to delete a favourite from the list of favourites
  const deleteFavorite = (title) => {
    fetch("/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        const newFavorites = favorites.filter(
          (favorite) => favorite.title !== title
        );
        setFavorites(newFavorites);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //   Function to toggle the favorite button
  const toggleFavorite = (id, title, artistName, img) => {
    const favoriteExists = favorites.some(
      (favorite) => favorite.title === title
    );
    if (favoriteExists) {
      deleteFavorite(title);
    } else {
      addFavorite(id, title, artistName, img);
    }
  };

  //   Function to handle the click event
  const clicked = (e, result) => {
    e.preventDefault();
    console.log("clicked: ", result);
    toggleFavorite(
      result.trackId,
      result.trackName,
      result.artistName,
      result.artworkUrl100
    );
    const star = e.target.closest(".card-cont").querySelector(".star");
    const starFill = e.target.closest(".card-cont").querySelector(".star-fill");
    getFavorites();

    star.classList.toggle("hidden");
    starFill.classList.toggle("hidden");
  };

  //   Function to handle the search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (search === "") return setError(true); // Prevents empty search
    setError(false); // Reset error state
    setLoading(true);
    await fetchResults();
    // Clear inputs after search
    setSearch("");
    searchTerm.current = search;
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="search-top">
          <div>
            <div className="search-cont">
              <input
                type="text"
                value={search}
                placeholder={
                  search === "" && error
                    ? "Please type in a valid search term..."
                    : ""
                }
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <button className="submit-btn" type="submit">
                Search
              </button>
            </div>
            <p style={{ marginBottom: 0, fontWeight: "bold" }}>
              filter by category:
            </p>
          </div>
          <div className="radio-cont">
            <label>
              <input
                type="radio"
                value="all"
                checked={mediaType === "all"}
                onChange={() => setMediaType("all")}
              />
              all
            </label>
            <label>
              <input
                type="radio"
                value="music"
                checked={mediaType === "music"}
                onChange={() => setMediaType("music")}
              />
              music
            </label>
            <label>
              <input
                type="radio"
                value="movie"
                checked={mediaType === "movie"}
                onChange={() => setMediaType("movie")}
              />
              movie
            </label>
            <label>
              <input
                type="radio"
                value="tvShow"
                checked={mediaType === "tvShow"}
                onChange={() => setMediaType("tvShow")}
              />
              tv show
            </label>
            <label>
              <input
                type="radio"
                value="ebook"
                checked={mediaType === "ebook"}
                onChange={() => setMediaType("ebook")}
              />
              ebook
            </label>
            <label>
              <input
                type="radio"
                value="podcast"
                checked={mediaType === "podcast"}
                onChange={() => setMediaType("podcast")}
              />
              podcast
            </label>
            <label>
              <input
                type="radio"
                value="shortFilm"
                checked={mediaType === "shortFilm"}
                onChange={() => setMediaType("shortFilm")}
              />
              shortFilm
            </label>
            <label>
              <input
                type="radio"
                value="software"
                checked={mediaType === "software"}
                onChange={() => setMediaType("software")}
              />
              software
            </label>
            <label>
              <input
                type="radio"
                value="musicVideo"
                checked={mediaType === "musicVideo"}
                onChange={() => setMediaType("musicVideo")}
              />
              music video
            </label>
          </div>
        </div>
        <div>
          <FavoritesList
            favorites={favorites}
            deleteFavorite={deleteFavorite}
          />
        </div>
      </form>
      {loading && <p>Loading...</p>}
      <p>
        {results.length > 0 ? (
          <span className="pill">
            Number of results for <strong>"{searchTerm.current}"</strong>:{" "}
            <strong>{results.length}</strong>
          </span>
        ) : (
          ""
        )}
      </p>
      <ul className="results-cont">
        {searchTerm.current === null && !error ? (
          <li className="pill" style={{ backgroundColor: "lightblue" }}>
            Search something above...
          </li>
        ) : results !== undefined && results.length !== 0 ? (
          results.map((result) => (
            <li
              key={result.trackId + 1}
              onClick={(e) => clicked(e, result)}
              className="card-cont"
            >
              <Star className="star" />
              <StarFill className="star-fill hidden" />

              <img
                className="card-img"
                src={result.artworkUrl100}
                alt={result.collectionName || result.trackName}
              />
              <div className="card-body">
                <p className="copy">
                  <strong>{result.trackName}</strong>
                </p>
                <p className="copy">{result.artistName}</p>
              </div>
            </li>
          ))
        ) : error ? (
          <li
            className="pill"
            style={{
              fontWeight: "bold",
              color: "white",
              backgroundColor: "red",
            }}
          >
            Please type in a valid search term...
          </li>
        ) : (
          <li className="pill">
            no search result found for "<strong>{searchTerm.current}...</strong>
            "
          </li>
        )}
      </ul>
    </div>
  );
}

export default Search;
