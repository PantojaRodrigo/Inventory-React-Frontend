import React, { act } from "react";
//import { render, screen, waitFor } from '../setupTests';
import Inventory from "../../pages/Inventory";
import { MockedProvider } from "@apollo/client/testing";
import { DELETE_ITEM, GET_ITEMS_WITH_SEARCH } from "../../queries";
import Item, { Location } from "../../interfaces/Item";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";

const location: Location[] = [
  {
    locationId: 1,
    address: "MainSt",
    state: "California",
    phoneNumber: "991923",
  },
  {
    locationId: 2,
    address: "MainSt",
    state: "California",
    phoneNumber: "991923",
  },
  {
    locationId: 3,
    address: "MainSt",
    state: "California",
    phoneNumber: "991923",
  },
  {
    locationId: 4,
    address: "MainSt",
    state: "California",
    phoneNumber: "991923",
  },
  {
    locationId: 5,
    address: "MainSt",
    state: "California",
    phoneNumber: "991923",
  },
  {
    locationId: 6,
    address: "MainSt",
    state: "California",
    phoneNumber: "991923",
  },
];
const mockItems: Item[] = [
  {
    itemId: 111,
    itemName: "Item 1",
    description: "Description 1",
    location: location[0],
  },
  {
    itemId: 222,
    itemName: "Item 2",
    description: "Description 2",
    location: location[1],
  },
  {
    itemId: 333,
    itemName: "Item 3",
    description: "Description 3",
    location: location[2],
  },
  {
    itemId: 444,
    itemName: "Item 4",
    description: "Description 4",
    location: location[3],
  },
  {
    itemId: 555,
    itemName: "Item 5",
    description: "Description 5",
    location: location[4],
  },
  {
    itemId: 666,
    itemName: "Item 6",
    description: "Description 6",
    location: location[5],
  },
];
const mocks = [
  {
    request: {
      query: GET_ITEMS_WITH_SEARCH,
      variables: { search: "" },
    },
    result: {
      data: {
        items: mockItems,
      },
    },
  },
  {
    request: {
      query: GET_ITEMS_WITH_SEARCH,
      variables: { search: "6" },
    },
    result: {
      data: {
        items: [
          {
            itemId: 666,
            itemName: "Item 6",
            description: "Description 6",
            location: location[5],
          },
        ],
      },
    },
  },
  {
    request: {
      query: DELETE_ITEM,
      variables: { id: 111 },
    },
    result: {
      data: {
        deleteItem: {
          id: 111,
          name: "Item 1",
        },
      },
    },
  },
];
const setup = () => {
  const router = createMemoryRouter(
    [
      { path: "/items", element: <Inventory /> },
      { path: "/items/111", element: <div>Item 111 page</div> },
      { path: "/items/111/newItem", element: <div>Item 111 edit page</div> },
    ],
    {
      initialEntries: ["/items"],
    }
  );

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <RouterProvider router={router} />
    </MockedProvider>
  );
};
describe("Inventory Component", () => {
  //HAPPY PATH
  test("renders inventory and displays items (when there are)", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
      expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Item 2/i)).toBeInTheDocument();
    });
  });
  //  DETAIL PAGE
  test("should go to Item Detail Page on click", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Item 1/i));
    expect(screen.getByText(/Item 111 page/i)).toBeInTheDocument();
  });
  //  UPDATE PAGE
  test("should go to Update Item page on edit button click", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByLabelText(/update/i)[0]);
    expect(screen.getByText(/Item 111 edit page/i)).toBeInTheDocument();
  });
  //  DELETE FUNCTIONALITY
  test("should open delete confirmation modal on delete button click", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();

    expect(screen.queryByText(/Are you sure you want to delete this item?/i)).toBeNull();
    fireEvent.click(screen.getAllByLabelText(/delete/i)[0]);

    expect(screen.getByText(/Are you sure you want to delete this item?/i)).toBeInTheDocument();
  });
  test("should close delete confirmation modal on No", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();

    expect(screen.queryByText(/Are you sure you want to delete this item?/i)).toBeNull();
    fireEvent.click(screen.getAllByLabelText(/delete/i)[0]);

    expect(screen.queryByText(/Are you sure you want to delete this item?/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("No"));

    await waitFor(() => {
      expect(screen.queryByText(/Are you sure you want to delete this item?/i)).toBeNull();
    });
  });
  test("should delete an item succesfully", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByLabelText(/delete/i)[0]);

    expect(screen.queryByText(/Are you sure you want to delete this item?/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(screen.queryByText(/Item 1/i)).toBeNull();
    });

    expect(screen.getByText(/Item 2/i)).toBeInTheDocument();
  });
  //    SUCCESS SNACKBAR
  test("should show snackbar on delete", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByLabelText(/delete/i)[0]);

    expect(screen.queryByText(/Are you sure you want to delete this item?/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(screen.queryByText(/Item deleted!/i)).toBeInTheDocument();
    });
  });
  test("should show snackbar on delete and close automatically", async () => {
    setup();
    jest.useFakeTimers();
    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByLabelText(/delete/i)[0]);

    expect(screen.queryByText(/Are you sure you want to delete this item?/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText("Yes"));
    jest.useFakeTimers();
    await waitFor(() => {
      expect(screen.queryByText(/Item deleted!/i)).toBeInTheDocument();
    });
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    await waitFor(() => {
      expect(screen.queryByText(/Item deleted!/i)).toBeNull();
    });
  });
  //  SEARCH FUNCTIONALITY
  test("should search an item succesfully", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();

    const input = screen.getByLabelText("Search items") as HTMLInputElement;

    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "6" } });

    await waitFor(() => {
      expect(screen.getByText(/Showing 1 items/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Item 1/i)).toBeNull();
    expect(screen.queryByText(/Item 2/i)).toBeNull();
    expect(screen.queryByText(/Item 3/i)).toBeNull();
    expect(screen.queryByText(/Item 4/i)).toBeNull();
    expect(screen.queryByText(/Item 5/i)).toBeNull();
    expect(screen.getByText(/Item 6/i)).toBeInTheDocument();
  });
  //  PAGINATION FUNCTIONALITY
  test("should show first 6 items", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Item 6/i)).toBeNull();
  });
  test("should change page and show item 6", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText(/next page/i));

    await waitFor(() => {
      expect(screen.queryByText(/Item 1/i)).toBeNull();
      expect(screen.queryByText(/Item 6/i)).toBeInTheDocument();
    });
  });
  //NON HAPPY PATHS
  test("renders 'No items' when there are none", async () => {
    const router = createMemoryRouter([{ path: "/items", element: <Inventory /> }], {
      initialEntries: ["/items"],
    });
    const noItemsMock = [
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
    ];
    render(
      <MockedProvider mocks={noItemsMock} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Showing 0 items/i)).toBeInTheDocument();
      expect(screen.queryByText(/Item 1/i)).toBeNull();
      expect(screen.getByText(/No items found/i)).toBeInTheDocument();
    });
  });
  test("should show ApolloErrorPage on network error (GraphQL Server FAIL)", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEMS_WITH_SEARCH,
          variables: { search: "" },
        },
        error: new ApolloError({
          errorMessage: "Network error",
          networkError: new Error("Network error"),
        }),
      },
    ];

    const router = createMemoryRouter([{ path: "/items", element: <Inventory /> }], {
      initialEntries: ["/items"],
    });

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("There was an error conecting with the server.")).toBeInTheDocument();
    });
  });
  test("should show ApolloErrorPage on network error (Backend FAIL)", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEMS_WITH_SEARCH,
          variables: { search: "" },
        },
        error: new GraphQLError("Cannot connect with the server.", {
          extensions: {
            code: "NETWORK_ERROR",
          },
        }),
      },
    ];

    const router = createMemoryRouter([{ path: "/items", element: <Inventory /> }], {
      initialEntries: ["/items"],
    });

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("There was a problem connecting to the server")).toBeInTheDocument();
      expect(screen.getByText("Cannot connect with the server.")).toBeInTheDocument();
    });
  });
  test("should show Error snackbar when handling error during item deletion", async () => {
    const errorMocks = [
      {
        request: {
          query: DELETE_ITEM,
          variables: { id: 111 },
        },
        error: new ApolloError({
          errorMessage: "Failed to delete item",
          graphQLErrors: [new GraphQLError("Deletion error")],
        }),
      },
      {
        request: {
          query: GET_ITEMS_WITH_SEARCH,
          variables: { search: "" },
        },
        result: {
          data: {
            items: mockItems,
          },
        },
      },
    ];

    const router = createMemoryRouter([{ path: "/items", element: <Inventory /> }], {
      initialEntries: ["/items"],
    });

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByLabelText(/delete/i)[0]);

    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete this item?/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(screen.getByText(/Failed to delete item/i)).toBeInTheDocument();
    });
  });

  /* test("should close delete confirmation modal when clicking outside", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();

    expect(
      screen.queryByText(/Are you sure you want to delete this item?/i)
    ).toBeNull();
    fireEvent.click(screen.getAllByLabelText(/delete/i)[0]);

    expect(
      screen.queryByText(/Are you sure you want to delete this item?/i)
    ).toBeInTheDocument();

    //TODO
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(
        screen.queryByText(/Are you sure you want to delete this item?/i)
      ).toBeNull();
    });
  }); */
});
