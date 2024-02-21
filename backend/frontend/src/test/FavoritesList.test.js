import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import FavoritesList from "../components/Favourites"; // Adjust the import path

test("calls deleteFavorite function when delete icon is clicked", () => {
  const favorites = [
    { id: 1, title: "Favorite 1", artistName: "Artist 1", img: "image1.jpg" },
  ];
  const deleteFavorite = jest.fn();

  render(
    <FavoritesList favorites={favorites} deleteFavorite={deleteFavorite} />
  );

  const deleteIcon = screen.getByTestId("delete-icon"); // Use screen instead of destructuring getByTestId
  fireEvent.click(deleteIcon);

  expect(deleteFavorite).toHaveBeenCalledWith(favorites[0].title);
});
