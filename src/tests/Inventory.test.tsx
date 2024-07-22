import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Inventory from "../routes/Inventory";
import {
  createMemoryRouter,
  json,
  MemoryRouter,
  RouterProvider,
} from "react-router-dom";
import Item, { Location } from "../interfaces/Item";

// Mock data
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
global.fetch = jest.fn((url) => {
  if (url.includes("/items")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockItems),
    });
  } else if (url.includes("/items/1")) {
    return Promise.resolve({
      ok: true,
      status: 200,
    });
  }
  return Promise.reject(new Error("Unknown endpoint"));
}) as jest.Mock;
const mockNavigate = jest.fn();
// Mock the dependencies
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  /* useLoaderData: jest.fn(),
  useActionData: jest.fn(), */
  //useNavigate: () => mockNavigate,
}));

// Define rutas y elementos de prueba
const routes = [
  {
    path: "/",
    element: <Inventory />,
    loader: async () => mockItems,
    action: async ({ request }: { request: Request }) => {
      const formData = await request.formData();
      const itemId = formData.get("itemId");
      console.log("Llamando accion...");

      // Simular eliminación de item
      return json({ message: "eliminado con exito" }, { status: 200 });
    },
  },
];
jest.mock("../components/ItemsTable", () => ({
  __esModule: true,
  default: ({
    items,
    handleModalOpen,
  }: {
    items: Item[];
    handleModalOpen: Function;
  }) => (
    <div>
      <div>ItemsTable</div>
      {items.map((item) => (
        <div key={item.itemId}>
          <div> {item.itemName}</div>
          <div aria-label="delete" onClick={() => handleModalOpen(item.itemId)}>
            Borrar
          </div>
        </div>
      ))}
    </div>
  ),
}));
jest.mock("../components/SearchField", () => ({
  __esModule: true,
  default: ({ searchFn }: { searchFn: any }) => (
    <input
      type="text"
      onChange={(e) => searchFn(e.target.value)}
      data-testid="search-field"
    />
  ),
}));

const mockResponse = { status: 200 };
const router = createMemoryRouter(routes, {
  initialEntries: ["/"],
});
describe("Inventory component", () => {
  beforeEach(() => {
    render(<RouterProvider router={router} />);
  });

  test("renders the component correctly", async () => {
    await waitFor(() => {
      expect(screen.getByText("Showing 6 items")).toBeInTheDocument();
      expect(screen.getByText(/ItemsTable/i)).toBeInTheDocument();
    });
  });

  test("open and closes the modal", async () => {
    await waitFor(() =>
      expect(screen.getByText("Showing 6 items")).toBeInTheDocument()
    );

    const deleteButton = screen.getAllByLabelText("delete")[0];
    act(() => {
      fireEvent.click(deleteButton);
    });

    expect(
      screen.getByText(/Are you sure you want to delete this item\?/i)
    ).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByText("No"));
    });
    await waitFor(() =>
      expect(
        screen.queryByText(/Are you sure you want to delete this item\?/i)
      ).not.toBeInTheDocument()
    );
  });

  test("open the modal and deletes the item", async () => {
    await waitFor(() =>
      expect(screen.getByText("Showing 6 items")).toBeInTheDocument()
    );

    const deleteButton = screen.getAllByLabelText("delete")[0];
    act(() => {
      fireEvent.click(deleteButton);
    });

    expect(
      screen.getByText(/Are you sure you want to delete this item\?/i)
    ).toBeInTheDocument();

    const spyAction = jest.spyOn(routes[0], "action");

    act(() => {
      fireEvent.click(screen.getByText("Yes"));
    });
    console.log(spyAction.mockImplementation);

    await waitFor(() => {
      expect(spyAction).toHaveBeenCalledTimes(1);
      /* const formData = new FormData();
      formData.set("itemId", "111");
      expect(spyAction).toHaveBeenCalledWith(
        expect.objectContaining({ request: expect.anything() })
      ); */
      expect(screen.queryByText(/Item deleted!/i)).toBeInTheDocument();
    });
  });

  test("search function triggers navigation", async () => {
    await waitFor(() =>
      expect(screen.getByText("Showing 6 items")).toBeInTheDocument()
    );
    act(() => {
      fireEvent.change(screen.getByTestId("search-field"), {
        target: { value: "test" },
      });
    });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/items");
      expect(router.state.location.search).toBe("?search=test");
    });
  });

  test("open Add Item page", async () => {
    await waitFor(() =>
      expect(screen.getByText("Showing 6 items")).toBeInTheDocument()
    );
    act(() => {
      fireEvent.click(screen.getByLabelText("add"));
    });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/items/newItem");
    });
  });
});
