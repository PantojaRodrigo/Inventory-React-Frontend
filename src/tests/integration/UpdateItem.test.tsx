import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RouterProvider, createMemoryRouter } from "react-router";
import Item from "../../interfaces/Item";
import { ApolloError, InMemoryCache } from "@apollo/client";
import NewItem from "../../pages/NewItem";
import { ADD_ITEM, GET_ITEM, GET_ITEMS_WITH_SEARCH, UPDATE_ITEM } from "../../queries";
import { MockedProvider } from "@apollo/client/testing";
import { GraphQLError } from "graphql";
import UpdateItem from "../../pages/UpdateItem";
import Inventory from "../../pages/Inventory";
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
const initialItem: Item = {
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
const updatedItem: Item = {
  itemId: 111,
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
        items: [initialItem],
      },
    },
  },
  {
    request: {
      query: GET_ITEM,
      variables: { id: 111 },
    },
    result: {
      data: {
        item: initialItem,
      },
    },
  },
  {
    request: {
      query: UPDATE_ITEM,
      variables: { id: initialItem.itemId, newItem: updatedItem },
    },
    result: {
      data: {
        updateItem: {
          itemId: initialItem.itemId,
          itemName: updatedItem.itemName,
          description: updatedItem.description,
        },
      },
    },
  },
];
const setup = (route: string) => {
  const router = createMemoryRouter(
    [
      { path: "/items/:itemId/newItem", element: <UpdateItem /> },
      { path: "/items/111", element: <div>Item 111</div> },
      { path: "/items/", element: <Inventory /> },
    ],
    {
      initialEntries: [route],
    }
  );

  const cache = new InMemoryCache({ addTypename: false });

  render(
    <MockedProvider mocks={mocks} addTypename={false} cache={cache}>
      <RouterProvider router={router} />
    </MockedProvider>
  );
};
describe("UpdateItem", () => {
  test("renders loading spinner while data is being fetched", async () => {
    setup("/items/111/newItem");

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
  test("renders the view correctly with pre-filled inputs", async () => {
    setup("/items/111/newItem");
    await waitFor(() => {
      expect(screen.getByText("Update Item")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("ID")).toHaveValue(initialItem.itemId);
    expect(screen.getByLabelText("Item Name")).toHaveValue(initialItem.itemName);
    expect(screen.getByLabelText("Item Description")).toHaveValue(initialItem.description);
    expect(screen.getByLabelText("Location ID")).toHaveValue(initialItem.location.locationId);
    expect(screen.getByLabelText("State")).toHaveValue(initialItem.location.state);
    expect(screen.getByLabelText("Address")).toHaveValue(initialItem.location.address);
    expect(screen.getByLabelText("Phone number")).toHaveValue(initialItem.location.phoneNumber);
  });

  test("renders the ID field but disabled", async () => {
    setup("/items/111/newItem");
    await waitFor(() => {
      expect(screen.getByText("Update Item")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("ID")).toBeDisabled();
  });
  test("renders 'No Item Found' component when no item is returned", async () => {
    const noItemMocks = [
      {
        request: {
          query: GET_ITEM,
          variables: { id: 111 },
        },
        result: {
          data: { item: null },
        },
      },
    ];

    render(
      <MockedProvider mocks={noItemMocks} addTypename={false}>
        <RouterProvider
          router={createMemoryRouter([{ path: "/:itemId/newItem", element: <UpdateItem /> }], {
            initialEntries: ["/111/newItem"],
          })}
        />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Item Not Found/i)).toBeInTheDocument();
    });
  });

  test("updates the item correctly", async () => {
    setup("/items");

    await waitFor(()=>{
      screen.findByText("Showing 1 items");
      screen.findByText(/New Item/i);
    })

    fireEvent.click((await screen.findAllByLabelText(/update/i))[0]);
    await waitFor(() => {
      expect(screen.getByText("Update Item")).toBeInTheDocument();
    });
    fireEvent.change(screen.getByLabelText("Item Name"), { target: { value: "New Item 2" } });
    fireEvent.change(screen.getByLabelText("Item Description"), {
      target: { value: "Test Description 2" },
    });
    fireEvent.change(screen.getByLabelText("Location ID"), { target: { value: 2 } });
    fireEvent.change(screen.getByLabelText("State"), { target: { value: "Test State 2" } });
    fireEvent.change(screen.getByLabelText("Address"), { target: { value: "Test Address 2" } });
    fireEvent.change(screen.getByLabelText("Phone number"), { target: { value: "12345678902" } });

    fireEvent.click(screen.getByRole("button", { name: /Update item/i }));

    await waitFor(() => {
      expect(screen.getByText("Item 111")).toBeInTheDocument();
    });
  });

  //ERRORS
  test("displays Network Error when server not responding", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEM,
          variables: { id: 111 },
        },
        result: {
          data: {
            item: initialItem,
          },
        },
      },
      {
        request: {
          query: UPDATE_ITEM,
          variables: { id: initialItem.itemId, newItem: initialItem },
        },
        error: new ApolloError({
          errorMessage: "Network error",
          networkError: new Error("Network error"),
        }),
      },
    ];
    const router = createMemoryRouter(
      [{ path: "/items/:itemId/newItem", element: <UpdateItem /> }],
      { initialEntries: ["/items/111/newItem"] }
    );
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Update Item")).toBeInTheDocument();
    });

    //Submit form
    fireEvent.click(screen.getByRole("button", { name: /Update item/i }));

    await waitFor(() => {
      expect(screen.getByText("There was a problem connecting to the server")).toBeInTheDocument();
    });
  });
  test("displays Network Error when server not responding (2)", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEM,
          variables: { id: 111 },
        },
        result: {
          data: {
            item: initialItem,
          },
        },
      },
      {
        request: {
          query: UPDATE_ITEM,
          variables: { id: initialItem.itemId, newItem: initialItem },
        },
        error: new GraphQLError("Cannot connect with the server.", {
          extensions: {
            code: "NETWORK_ERROR",
          },
        }),
      },
    ];
    const router = createMemoryRouter(
      [{ path: "/items/:itemId/newItem", element: <UpdateItem /> }],
      { initialEntries: ["/items/111/newItem"] }
    );
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Update Item")).toBeInTheDocument();
    });

    //Submit form
    fireEvent.click(screen.getByRole("button", { name: /Update item/i }));

    await waitFor(() => {
      expect(screen.getByText("There was a problem connecting to the server")).toBeInTheDocument();
    });
  });
  test("displays Error when ID is already existing ", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEM,
          variables: { id: 111 },
        },
        result: {
          data: {
            item: initialItem,
          },
        },
      },
      {
        request: {
          query: UPDATE_ITEM,
          variables: { id: initialItem.itemId, newItem: initialItem },
        },
        error: new GraphQLError("The location with that ID already exists"),
      },
    ];
    const router = createMemoryRouter(
      [{ path: "/items/:itemId/newItem", element: <UpdateItem /> }],
      { initialEntries: ["/items/111/newItem"] }
    );
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Update Item")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Update item/i }));

    await waitFor(() => {
      expect(screen.getByText("The location with that ID already exists")).toBeInTheDocument();
    });
  });
});
