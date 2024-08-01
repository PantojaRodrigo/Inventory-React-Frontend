import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router, RouterProvider } from "react-router-dom";
import { createMemoryRouter } from "react-router";
import ItemForm from "../../components/ItemForm";
import { useAddItem, useUpdateItem } from "../../hooks/useItemMutations";
import { useFormHandlers } from "../../hooks/useFormHandlers";
import Item from "../../interfaces/Item";

jest.mock("../../components/FormFields", () => () => <div>FormFields</div>);
jest.mock("../../components/ItemFormDialog", () => () => (
  <div>ItemFormDialog</div>
));
jest.mock("../../components/ItemFormSnackbar", () => () => (
  <div>ItemFormSnackbar</div>
));
// Mock hooks
jest.mock("../../hooks/useItemMutations", () => ({
  useAddItem: jest.fn(),
  useUpdateItem: jest.fn(),
}));

jest.mock("../../hooks/useFormHandlers", () => ({
  useFormHandlers: jest.fn(),
}));

// Mocks
const mockAddItem = jest.fn();
const mockUpdateItem = jest.fn();
const mockUseFormHandlers = jest.fn();

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Form: ({ children }: { children: React.ReactNode }) => (
    <form>{children}</form>
  ),
}));

const mockItem: Item = {
  itemId: 1,
  itemName: "Test Item",
  description: "Test Description",
  location: {
    locationId: 1,
    state: "Test State",
    address: "Test Address",
    phoneNumber: 1234567890,
  },
};

describe("ItemForm", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useAddItem as jest.Mock).mockReturnValue({
      addItem: mockAddItem,
      addError: undefined,
      addLoading: false,
    });
    (useUpdateItem as jest.Mock).mockReturnValue({
      updateItem: mockUpdateItem,
      updateError: undefined,
      updateLoading: false,
    });
    (useFormHandlers as jest.Mock).mockReturnValue({
      errors: {},
      modalOpen: false,
      snackOpen: false,
      form: React.createRef(),
      handleSnackClose: jest.fn(),
      handleModalClose: jest.fn(),
      handleModalOpen: jest.fn(),
      handleSubmitForm: jest.fn(),
      setSnackOpen: jest.fn(),
    });
  });

  test("renders the form with correct title and fields", () => {
    const routes = [
      {
        path: "/",
        element: <ItemForm method="POST" item={null} />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByText("Create New Item")).toBeInTheDocument();
    expect(screen.getByText("FormFields")).toBeInTheDocument();
  });

  it("renders the update title when method is PATCH and item is provided", () => {
    render(
      <Router>
        <ItemForm method="PATCH" item={mockItem} />
      </Router>
    );

    expect(screen.getByText("Update Item")).toBeInTheDocument();
  });

  it("displays error messages when errors are present", () => {
    (useAddItem as jest.Mock).mockReturnValue({
      addItem: mockAddItem,
      addError: new Error("Add error occurred"),
      addLoading: false,
    });
    (useUpdateItem as jest.Mock).mockReturnValue({
      updateItem: mockUpdateItem,
      updateError: new Error("Update error occurred"),
      updateLoading: false,
    });

    render(
      <Router>
        <ItemForm method="POST" item={null} />
      </Router>
    );

    expect(screen.getByText("Add error occurred")).toBeInTheDocument();

    render(
      <Router>
        <ItemForm method="PATCH" item={mockItem} />
      </Router>
    );

    expect(screen.getByText("Update error occurred")).toBeInTheDocument();
  });

  it("calls navigate on successful update", async () => {
    (useUpdateItem as jest.Mock).mockReturnValue({
      updateItem: mockUpdateItem,
      updateError: undefined,
      updateLoading: false,
    });

    render(
      <Router>
        <ItemForm method="PATCH" item={mockItem} />
      </Router>
    );

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(`/items/${mockItem.itemId}`)
    );
  });

  it("handles form submission correctly", async () => {
    const handleSubmitForm = jest.fn();
    (useFormHandlers as jest.Mock).mockReturnValue({
      errors: {},
      modalOpen: false,
      snackOpen: false,
      form: React.createRef(),
      handleSnackClose: jest.fn(),
      handleModalClose: jest.fn(),
      handleModalOpen: jest.fn(),
      handleSubmitForm,
      setSnackOpen: jest.fn(),
    });

    render(
      <Router>
        <ItemForm method="POST" item={null} />
      </Router>
    );

    const submitButton = screen.getByRole("button", { name: /Add item/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(handleSubmitForm).toHaveBeenCalled());
  });
});
