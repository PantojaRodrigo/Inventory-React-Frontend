import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
//import "@testing-library/jest-dom/extend-expect";
import InventorySnackbar from "../../components/InventorySnackbar";
import { ApolloError } from "@apollo/client";

describe("InventorySnackbar component", () => {
  const mockOnClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("displays success message when there is no error", () => {
    render(<InventorySnackbar open={true} onClose={mockOnClose} />);

    expect(screen.getByText("Item deleted!")).toBeInTheDocument();
  });

  test("displays error message when there is an error", () => {
    const error = new ApolloError({ errorMessage: "Test error message" });

    render(
      <InventorySnackbar open={true} error={error} onClose={mockOnClose} />
    );

    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  test("calls onClose when Snackbar is closed by button", () => {
    const { container } = render(
      <InventorySnackbar open={true} onClose={mockOnClose} />
    );

    const alertCloseButton = screen.getByLabelText("Close");
    fireEvent.click(alertCloseButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("calls onClose when Snackbar is closed by waiting", () => {
    jest.useFakeTimers();
    render(<InventorySnackbar open={true} onClose={mockOnClose} />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockOnClose).toHaveBeenCalled();
  });
});
