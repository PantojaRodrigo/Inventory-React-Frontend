import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router, RouterProvider } from "react-router-dom";
import { createMemoryRouter } from "react-router";
import ItemForm from "../../components/ItemForm";
import { useAddItem, useUpdateItem } from "../../hooks/useItemMutations";
import { useFormHandlers } from "../../hooks/useFormHandlers";
import Item from "../../interfaces/Item";
import ItemFormSnackbar from "../../components/ItemFormSnackbar";
import ItemFormDialog from "../../components/ItemFormDialog";
import FormFields from "../../components/FormFields";
import ApolloErrorPage from "../../pages/ApolloErrorPage";
import { ApolloError } from "@apollo/client";

jest.mock("../../components/FormFields", () => () => <div>FormFields</div>);
jest.mock("../../components/ItemFormDialog", () => () => (
  <div>ItemFormDialog</div>
));
jest.mock("../../components/ItemFormSnackbar", () => () => (
  <div>ItemFormSnackbar</div>
));
jest.mock("../../pages/ApolloErrorPage", () => {
  return ({ error }: { error: ApolloError }) => <div>{error.message}</div>;
});
// Mock hooks
jest.mock("../../hooks/useItemMutations", () => ({
  useAddItem: jest.fn(),
  useUpdateItem: jest.fn(),
}));

jest.mock("../../hooks/useFormHandlers", () => ({
  useFormHandlers: jest.fn(),
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
      addItem: jest.fn(),
      addError: undefined,
      addLoading: false,
    });
    (useUpdateItem as jest.Mock).mockReturnValue({
      updateItem: jest.fn(),
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
  //TODO: Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.Jest
  test("renders the create item title when POST method and no item is null", () => {
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
    expect(screen.getByText("Add item")).toBeInTheDocument();
  });
  test("renders the update title when method is PATCH and item is provided", () => {
    const routes = [
      {
        path: "/",
        element: <ItemForm method="PATCH" item={mockItem} />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByText("Update Item")).toBeInTheDocument();
    expect(screen.getByText("FormFields")).toBeInTheDocument();
    expect(screen.getByText("Update item")).toBeInTheDocument();
  });

  test("displays add error wher add fails", () => {
    jest.resetAllMocks();
    (useAddItem as jest.Mock).mockReturnValue({
      addItem: jest.fn(),
      addError: new ApolloError({
        errorMessage: "Add error occurred",
        networkError: new Error("NetworkError"),
      }),
      addLoading: false,
    });
    (useUpdateItem as jest.Mock).mockReturnValue({
      updateItem: jest.fn(),
      updateError: {},
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
    render(
      <Router>
        <ItemForm method="POST" item={null} />
      </Router>
    );

    expect(screen.getByText("Add error occurred")).toBeInTheDocument();
  });
  test("displays update error wher add update", () => {
    jest.resetAllMocks();
    (useAddItem as jest.Mock).mockReturnValue({
      addItem: jest.fn(),
      addError: null,
      addLoading: false,
    });
    (useUpdateItem as jest.Mock).mockReturnValue({
      updateItem: jest.fn(),
      updateError: new ApolloError({
        errorMessage: "Update error occurred",
        networkError: new Error("NetworkError"),
      }),
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

    render(
      <Router>
        <ItemForm method="PATCH" item={mockItem} />
      </Router>
    );

    expect(screen.getByText("Update error occurred")).toBeInTheDocument();
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
