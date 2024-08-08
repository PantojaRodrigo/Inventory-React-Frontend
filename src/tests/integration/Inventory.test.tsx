import React from "react";
//import { render, screen, waitFor } from '../setupTests';
import Inventory from "../../pages/Inventory";
import { MockedProvider } from "@apollo/client/testing";
import { DELETE_ITEM, GET_ITEMS_WITH_SEARCH } from "../../queries";
import Item, { Location } from "../../interfaces/Item";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const location: Location[] = [
  {
    locationId: 1,
    address: "MainSt",
    state: "California",
    phoneNumber: 991923,
  },
  {
    locationId: 2,
    address: "MainSt",
    state: "California",
    phoneNumber: 991923,
  },
  {
    locationId: 3,
    address: "MainSt",
    state: "California",
    phoneNumber: 991923,
  },
  {
    locationId: 4,
    address: "MainSt",
    state: "California",
    phoneNumber: 991923,
  },
  {
    locationId: 5,
    address: "MainSt",
    state: "California",
    phoneNumber: 991923,
  },
  {
    locationId: 6,
    address: "MainSt",
    state: "California",
    phoneNumber: 991923,
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
      query: DELETE_ITEM,
      variables: { id: "111" },
    },
    result: {
      data: {
        deleteItem: {
          id: "111",
          name: "Item 1",
        },
      },
    },
  },
];

describe("Inventory Component", () => {
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
  test("renders inventory and displays items", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
      expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Item 2/i)).toBeInTheDocument();
    });
  });

  test("should go to Item Detail Page on click", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Item 1/i));
    expect(screen.getByText(/Item 111 page/i)).toBeInTheDocument();
  });

  test("should go to Update Item page on edit button click", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByLabelText(/update/i)[0]);
    expect(screen.getByText(/Item 111 edit page/i)).toBeInTheDocument();
  });

  test("should open delete confirmation modal on delete button click", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByLabelText(/delete/i)[0]);

    expect(
      screen.getByText(/Are you sure you want to delete this item?/i)
    ).toBeInTheDocument();
  });

  test("should open delete confirmation modal on delete button click", async () => {
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
      screen.getByText(/Are you sure you want to delete this item?/i)
    ).toBeInTheDocument();
  });

  test("should close delete confirmation modal on No", async () => {
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

    fireEvent.click(screen.getByText("No"));

    await waitFor(() => {
      expect(
        screen.queryByText(/Are you sure you want to delete this item?/i)
      ).toBeNull();
    });
  });

  test("should delete an item succesfully", async () => {
    setup();

    await waitFor(() => {
      expect(screen.getByText(/Showing 6 items/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByLabelText(/delete/i)[0]);

    expect(
      screen.queryByText(/Are you sure you want to delete this item?/i)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Yes"));

    await waitFor(() => {
      expect(screen.queryByText(/Item 1/i)).toBeNull();
    });

    expect(screen.getByText(/Item 2/i)).toBeInTheDocument();
  });

  test("should close delete confirmation modal when clicking outside", async () => {
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

    //click outside the modal
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(
        screen.queryByText(/Are you sure you want to delete this item?/i)
      ).toBeNull();
    });
  });
});
