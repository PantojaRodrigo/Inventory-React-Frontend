import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RouterProvider, createMemoryRouter } from "react-router";
import Item from "../../interfaces/Item";
import { ApolloError } from "@apollo/client";
import NewItem from "../../pages/NewItem";
import { ADD_ITEM, GET_ITEMS_WITH_SEARCH } from "../../queries";
import { MockedProvider } from "@apollo/client/testing";
import { GraphQLError } from "graphql";
const mockItem: Item = {
  itemId: 1,
  itemName: "1",
  description: "",
  location: {
    locationId: 1,
    state: "1",
    address: "",
    phoneNumber: "",
  },
};
const mockItem1: Item = {
  itemId: 111,
  itemName: "New Item",
  description: "Test Description",
  location: {
    locationId: 1,
    state: "Test State",
    address: "Test Address",
    phoneNumber: "1234567890",
  },
};
const mockItem2: Item = {
  itemId: 222,
  itemName: "New Item 2",
  description: "Test Description 2",
  location: {
    locationId: 2,
    state: "Test State 2",
    address: "Test Address 2",
    phoneNumber: "12345678902",
  },
};
const mocks = [
  {
    request: {
      query: GET_ITEMS_WITH_SEARCH,
      variables: { search: "" },
    },
    result: {
      data: {
        items: [mockItem2],
      },
    },
  },
  {
    request: {
      query: ADD_ITEM,
      variables: { newItem: mockItem1 },
    },
    result: {
      data: {
        addItem: {
          itemId: 111,
          itemName: "New Item",
          description: "Test Description",
        },
      },
    },
  },
];
const setup = () => {
  const router = createMemoryRouter([{ path: "/", element: <NewItem /> }], {
    initialEntries: ["/"],
  });

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <RouterProvider router={router} />
    </MockedProvider>
  );
};
describe("NewItem", () => {
  test("renders the view correctly", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getByText("Create New Item")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    expect(screen.getByLabelText("Item Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Item Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Location ID")).toBeInTheDocument();
    expect(screen.getByLabelText("State")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone number")).toBeInTheDocument();
    expect(screen.getByLabelText("Address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add item/i })).toBeInTheDocument();
  });

  test("displays 'is required' on fields when submitting an empty form", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getByText("Create New Item")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    //Submit form without data
    fireEvent.click(screen.getByRole("button", { name: /Add item/i }));

    await waitFor(() => {
      expect(screen.getByText("ID is required")).toBeInTheDocument();
      expect(screen.getByText("Item Name is required")).toBeInTheDocument();
      expect(screen.getByText("Location ID is required")).toBeInTheDocument();
      expect(screen.getByText("State is required")).toBeInTheDocument();
    });
  });
  test("displays 'must be positive' when submitting a non positive (in number fields)", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getByText("Create New Item")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: 0 } });
    fireEvent.change(screen.getByLabelText("Location ID"), {
      target: { value: -2 },
    });
    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: -3 },
    });
    //Submit form
    fireEvent.click(screen.getByRole("button", { name: /Add item/i }));

    await waitFor(() => {
      const elements = screen.getAllByText(/must be positive/i);
      expect(elements).toHaveLength(3);
    });
  });
  test("displays 'must be integer' when submitting a non integer (in number fields)", async () => {
    setup();
    await waitFor(() => {
      expect(screen.getByText("Create New Item")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: 1.5 } });
    fireEvent.change(screen.getByLabelText("Location ID"), {
      target: { value: 2.5 },
    });
    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: 3.5 },
    });
    //Submit form
    fireEvent.click(screen.getByRole("button", { name: /Add item/i }));

    await waitFor(() => {
      const elements = screen.getAllByText(/must be integer/i);
      expect(elements).toHaveLength(3);
    });
  });
  //ERRORS
  test("displays Network Error when server not responding", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEMS_WITH_SEARCH,
          variables: { search: "" },
        },
        result: {
          data: {
            items: [],
          },
        },
      },
      {
        request: {
          query: ADD_ITEM,
          variables: { newItem: mockItem },
        },
        error: new ApolloError({
          errorMessage: "Network error",
          networkError: new Error("Network error"),
        }),
      },
    ];
    const router = createMemoryRouter([{ path: "/", element: <NewItem /> }], {
      initialEntries: ["/"],
    });
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Create New Item")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    //Fill form to pass the validations
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: 1 } });
    fireEvent.change(screen.getByLabelText("Location ID"), { target: { value: 1 } });
    fireEvent.change(screen.getByLabelText("Item Name"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("State"), { target: { value: "1" } });
    //Submit form
    fireEvent.click(screen.getByRole("button", { name: /Add item/i }));

    await waitFor(() => {
      expect(screen.getByText("There was a problem connecting to the server")).toBeInTheDocument();
    });
  });
  test("displays Network Error when server not responding (2)", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEMS_WITH_SEARCH,
          variables: { search: "" },
        },
        result: {
          data: {
            items: [],
          },
        },
      },
      {
        request: {
          query: ADD_ITEM,
          variables: { newItem: mockItem },
        },
        error: new GraphQLError("Cannot connect with the server.", {
          extensions: {
            code: "NETWORK_ERROR",
          },
        }),
      },
    ];
    const router = createMemoryRouter([{ path: "/", element: <NewItem /> }], {
      initialEntries: ["/"],
    });
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Create New Item")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    //Fill form to pass the validations
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: 1 } });
    fireEvent.change(screen.getByLabelText("Location ID"), { target: { value: 1 } });
    fireEvent.change(screen.getByLabelText("Item Name"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("State"), { target: { value: "1" } });
    //Submit form
    fireEvent.click(screen.getByRole("button", { name: /Add item/i }));

    await waitFor(() => {
      expect(screen.getByText("There was a problem connecting to the server")).toBeInTheDocument();
    });
  });
  test("displays Error when ID is already existing ", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEMS_WITH_SEARCH,
          variables: { search: "" },
        },
        result: {
          data: {
            items: [],
          },
        },
      },
      {
        request: {
          query: ADD_ITEM,
          variables: { newItem: mockItem1 },
        },
        error: new GraphQLError("The item with ID: 111 already exist."),
      },
    ];
    const router = createMemoryRouter([{ path: "/", element: <NewItem /> }], {
      initialEntries: ["/"],
    });
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Create New Item")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    //Fill form to pass the validations
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: 111 } });
    fireEvent.change(screen.getByLabelText("Item Name"), { target: { value: "New Item" } });
    fireEvent.change(screen.getByLabelText("Item Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Location ID"), { target: { value: 1 } });
    fireEvent.change(screen.getByLabelText("State"), { target: { value: "Test State" } });
    fireEvent.change(screen.getByLabelText("Address"), { target: { value: "Test Address" } });
    fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: 1234567890 } });
    //Submit form
    fireEvent.click(screen.getByRole("button", { name: /Add item/i }));

    await waitFor(() => {
      expect(screen.getByText("The item with ID: 111 already exist.")).toBeInTheDocument();
    });
  });
  //HAPPY PATH
  test("displays error when creating item ", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEMS_WITH_SEARCH,
          variables: { search: "" },
        },
        result: {
          data: {
            items: [],
          },
        },
      },
      {
        request: {
          query: ADD_ITEM,
          variables: { newItem: mockItem1 },
        },
        error: new GraphQLError("There was an error while creating the item."),
      },
    ];
    const router = createMemoryRouter([{ path: "/", element: <NewItem /> }], {
      initialEntries: ["/"],
    });
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Create New Item")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    //Fill form to pass the validations
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: 111 } });
    fireEvent.change(screen.getByLabelText("Item Name"), { target: { value: "New Item" } });
    fireEvent.change(screen.getByLabelText("Item Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Location ID"), { target: { value: 1 } });
    fireEvent.change(screen.getByLabelText("State"), { target: { value: "Test State" } });
    fireEvent.change(screen.getByLabelText("Address"), { target: { value: "Test Address" } });
    fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: 1234567890 } });
    //Submit form
    fireEvent.click(screen.getByRole("button", { name: /Add item/i }));

    await waitFor(() => {
      expect(screen.getByText("There was an error while creating the item.")).toBeInTheDocument();
    });
  });
  test("handles form submission correctly", async () => {
    const router = createMemoryRouter([{ path: "/items/newItem", element: <NewItem /> }], {
      initialEntries: ["/items/newItem"],
    });
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Create New Item")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    //Fill form to pass the validations
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: 111 } });
    fireEvent.change(screen.getByLabelText("Item Name"), { target: { value: "New Item" } });
    fireEvent.change(screen.getByLabelText("Item Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Location ID"), { target: { value: 1 } });
    fireEvent.change(screen.getByLabelText("State"), { target: { value: "Test State" } });
    fireEvent.change(screen.getByLabelText("Address"), { target: { value: "Test Address" } });
    fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: 1234567890 } });
    //Submit form
    fireEvent.click(screen.getByRole("button", { name: /Add item/i }));
    expect(screen.queryByText("Item added successfully!")).toBeNull();
    expect(screen.queryByText("Do you want to keep adding items?")).toBeNull();
    await waitFor(() => {
      //Snackbar open
      expect(screen.getByText("Item added successfully!")).toBeInTheDocument();
      //Modal open
      expect(screen.getByText("Do you want to keep adding items?")).toBeInTheDocument();
    });
  });
  test("redirects to inventory when not to continue adding items", async () => {
    const router = createMemoryRouter(
      [
        { path: "/items/newItem", element: <NewItem /> },
        { path: "/items", element: <div>Inventory</div> },
      ],
      {
        initialEntries: ["/items/newItem"],
      }
    );
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Create New Item")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    //Fill form to pass the validations
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: 111 } });
    fireEvent.change(screen.getByLabelText("Item Name"), { target: { value: "New Item" } });
    fireEvent.change(screen.getByLabelText("Item Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Location ID"), { target: { value: 1 } });
    fireEvent.change(screen.getByLabelText("State"), { target: { value: "Test State" } });
    fireEvent.change(screen.getByLabelText("Address"), { target: { value: "Test Address" } });
    fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: 1234567890 } });
    //Submit form
    fireEvent.click(screen.getByRole("button", { name: /Add item/i }));
    expect(screen.queryByText("Item added successfully!")).toBeNull();
    expect(screen.queryByText("Do you want to keep adding items?")).toBeNull();
    await waitFor(() => {
      //Snackbar open
      expect(screen.getByText("Item added successfully!")).toBeInTheDocument();
      //Modal open
      expect(screen.getByText("Do you want to keep adding items?")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /No, go to inventory/i }));
    await waitFor(() => {
      expect(screen.getByText("Inventory")).toBeInTheDocument();
    });
  });
  test("cleans form when deciding to continue adding items", async () => {
    const router = createMemoryRouter([{ path: "/items/newItem", element: <NewItem /> }], {
      initialEntries: ["/items/newItem"],
    });
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Create New Item")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    //Fill form to pass the validations
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: 111 } });
    fireEvent.change(screen.getByLabelText("Item Name"), { target: { value: "New Item" } });
    fireEvent.change(screen.getByLabelText("Item Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Location ID"), { target: { value: 1 } });
    fireEvent.change(screen.getByLabelText("State"), { target: { value: "Test State" } });
    fireEvent.change(screen.getByLabelText("Address"), { target: { value: "Test Address" } });
    fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: 1234567890 } });
    //Submit form
    fireEvent.click(screen.getByRole("button", { name: /Add item/i }));

    await waitFor(() => {
      //Snackbar open
      expect(screen.getByText("Item added successfully!")).toBeInTheDocument();
      //Modal open
      expect(screen.getByText("Do you want to keep adding items?")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /Yes/i }));
    await waitFor(() => {
      expect(screen.queryByText("Do you want to keep adding items?")).toBeNull();
    });

    expect(screen.getByLabelText("ID")).toHaveValue(null);
    expect(screen.getByLabelText("Item Name")).toHaveValue("");
    expect(screen.getByLabelText("Item Description")).toHaveValue("");
    expect(screen.getByLabelText("Location ID")).toHaveValue(null);
    expect(screen.getByLabelText("State")).toHaveValue("");
    expect(screen.getByLabelText("Address")).toHaveValue("");
    expect(screen.getByLabelText("Phone number")).toHaveValue(null);
  });
});
