import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
//import "@testing-library/jest-dom/extend-expect";
import FormFields from "../../components/FormFields";
import Item from "../../interfaces/Item";

describe("FormFields component", () => {
  const mockItem: Item = {
    itemId: 1,
    itemName: "Test Item",
    description: "This is a test item",
    location: {
      locationId: 101,
      state: "Test State",
      address: "123 Test St",
      phoneNumber: 1234567890,
    },
  };

  const mockErrors = {
    id: "ID is required",
    itemName: "Item Name is required",
    locationId: "Location ID is required",
    state: "State is required",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all input fields with correct labels and values", () => {
    const { container } = render(<FormFields item={mockItem} errors={null} />);

    expect(screen.getByLabelText("ID")).toHaveValue(mockItem.itemId);
    expect(screen.getByLabelText("Item Name")).toHaveValue(mockItem.itemName);
    expect(screen.getByLabelText("Item Description")).toHaveValue(
      mockItem.description
    );
    expect(screen.getByLabelText("Location ID")).toHaveValue(
      mockItem.location.locationId
    );
    expect(screen.getByLabelText("State")).toHaveValue(mockItem.location.state);
    expect(screen.getByLabelText("Address")).toHaveValue(
      mockItem.location.address
    );
    expect(screen.getByLabelText("Phone number")).toHaveValue(
      mockItem.location.phoneNumber
    );
  });

  test("displays error messages when fields have errors", () => {
    render(<FormFields item={null} errors={mockErrors} />);

    expect(screen.getByText(mockErrors.id)).toBeInTheDocument();
    expect(screen.getByText(mockErrors.itemName)).toBeInTheDocument();
    expect(screen.getByText(mockErrors.locationId)).toBeInTheDocument();
    expect(screen.getByText(mockErrors.state)).toBeInTheDocument();
  });

  test("renders correctly when item is null", () => {
    render(<FormFields item={null} errors={null} />);

    expect(screen.getByLabelText("ID")).toHaveValue(null);
    expect(screen.getByLabelText("Item Name")).toHaveValue("");
    expect(screen.getByLabelText("Item Description")).toHaveValue("");
    expect(screen.getByLabelText("Location ID")).toHaveValue(null);
    expect(screen.getByLabelText("State")).toHaveValue("");
    expect(screen.getByLabelText("Address")).toHaveValue("");
    expect(screen.getByLabelText("Phone number")).toHaveValue(null);
  });

  test("ID field is disabled when item is not null", () => {
    render(<FormFields item={mockItem} errors={null} />);

    expect(screen.getByLabelText("ID")).toBeDisabled();
  });

  test("ID field is not disabled when item is null", () => {
    render(<FormFields item={null} errors={null} />);

    expect(screen.getByLabelText("ID")).not.toBeDisabled();
  });
});
