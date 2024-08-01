import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NoItems from "../../components/NoItems"; // Asegúrate de que la ruta sea correcta
import { ApolloError } from "@apollo/client";

describe("NoItems", () => {
  it("renders error message when there is an ApolloError", () => {
    const mockError = new ApolloError({
      errorMessage: "Something went wrong",
    });

    render(<NoItems empty={true} error={mockError} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByText("No items found")).toBeNull();
    expect(
      screen.queryByText(
        "Try adjusting your search or filter to find what you are looking for."
      )
    ).toBeNull();
    expect(
      screen.queryByText("You can filter items by name, description or state.")
    ).toBeNull();
  });

  it("renders no items message when there is no error and empty is true", () => {
    render(<NoItems empty={true} error={undefined} />);

    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "Try adjusting your search or filter to find what you are looking for."
      )
    ).toBeNull();
    expect(
      screen.queryByText("You can filter items by name, description or state.")
    ).toBeNull();
  });

  it("renders no items message and failed search results", () => {
    render(<NoItems empty={false} error={undefined} />);

    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Try adjusting your search or filter to find what you are looking for."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("You can filter items by name, description or state.")
    ).toBeInTheDocument();
  });
});
