import { Trash } from "react-bootstrap-icons";

function FavoritesList({ favorites, deleteFavorite }) {
  const handleDelete = (title) => {
    // Call deleteFavorite function with the title of the favorite to delete
    deleteFavorite(title);
  };
  return (
    <div style={{ width: "350px" }}>
      <h1 style={{ marginTop: "0" }}>Favorites</h1>
      <ul className="favorites">
        {favorites.map((favorite) => (
          <li className="favorite-cont" key={favorite.id + favorite.title}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                className="favorite-img"
                src={favorite.img}
                alt={favorite.title}
              />
              <div className="favorite-info">
                <p className="title-p">{favorite.title}</p>
                <p className="artist-p">{favorite.artistName}</p>
              </div>
              <Trash
                className="trash"
                data-testid="delete-icon" // Add data-testid here
                onClick={() => handleDelete(favorite.title)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoritesList;
