import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ItemFormSnackbar from "../../components/ItemFormSnackbar"; // Asegúrate de que la ruta sea correcta

describe("ItemFormSnackbar", () => {
  const mockHandleSnackClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the snackbar when snackOpen is true", () => {
    render(
      <ItemFormSnackbar
        snackOpen={true}
        handleSnackClose={mockHandleSnackClose}
      />
    );

    expect(screen.getByText("Item added successfully!")).toBeInTheDocument();
  });

  it("does not render the snackbar when snackOpen is false", () => {
    const { queryByText } = render(
      <ItemFormSnackbar
        snackOpen={false}
        handleSnackClose={mockHandleSnackClose}
      />
    );

    expect(queryByText("Item added successfully!")).toBeNull();
  });

  it("calls handleSnackClose when the snackbar is closed", () => {
    render(
      <ItemFormSnackbar
        snackOpen={true}
        handleSnackClose={mockHandleSnackClose}
      />
    );

    fireEvent.click(screen.getByLabelText("Close"));
    expect(mockHandleSnackClose).toHaveBeenCalledTimes(1);
  });

  it("calls handleSnackClose after autoHideDuration (3 seconds)", async () => {
    jest.useFakeTimers();
    render(
      <ItemFormSnackbar
        snackOpen={true}
        handleSnackClose={mockHandleSnackClose}
      />
    );

    jest.advanceTimersByTime(3000);

    expect(mockHandleSnackClose).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
