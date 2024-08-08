import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import ItemDetail from "../../pages/ItemDetail";
//import "@testing-library/jest-dom/extend-expect";
import { GET_ITEM } from "../../queries";
import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";
import { act } from "react";

const mockItem = {
  itemId: "1",
  itemName: "Test Item",
  description: "This is a test item",
  location: {
    locationId: "100",
    address: "123 Test St",
    state: "Test State",
    phoneNumber: "124567890",
  },
};
const mocks = [
  {
    request: {
      query: GET_ITEM,
      variables: { id: 1 },
    },
    result: {
      data: {
        item: mockItem,
      },
    },
  },
];
jest.mock("../../pages/ApolloErrorPage", () => () => <div>NetworkError</div>);
jest.mock("../../components/NoItemFound", () => () => <div>ItemNotFound</div>);
const routes = [
  {
    path: "/items/:itemId",
    element: <ItemDetail />,
  },
];
const router = createMemoryRouter(routes, {
  initialEntries: ["/items/1"],
});

describe("ItemDetail component", () => {
  beforeEach(() => {});
  test("renders loading state initially", async () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders item details correctly", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Item")).toBeInTheDocument();
    });

    expect(screen.getByText("ID:1")).toBeInTheDocument();
    expect(screen.getByText("This is a test item")).toBeInTheDocument();
    expect(screen.getByText("Location:")).toBeInTheDocument();
    expect(screen.getByText("ID: 100")).toBeInTheDocument();
    expect(screen.getByText("Address:")).toBeInTheDocument();
    expect(screen.getByText("123 Test St")).toBeInTheDocument();
    expect(screen.getByText("State:")).toBeInTheDocument();
    expect(screen.getByText("Test State")).toBeInTheDocument();
    expect(screen.getByText("124567890")).toBeInTheDocument();
  });

  test("renders Server error when server fails", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEM,
          variables: { id: 999 },
        },
        error: new GraphQLError("Cannot connect with the server.", {
          extensions: {
            code: "NETWORK_ERROR",
          },
        }),
      },
    ];
    const errorRouter = createMemoryRouter(routes, {
      initialEntries: ["/items/999"],
    });
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={errorRouter} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("NetworkError")).toBeInTheDocument();
    });
  });

  test("renders Item not found page when the item does not exist", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEM,
          variables: { id: 999 },
        },
        error: new GraphQLError("Item not found"),
      },
    ];
    const errorRouter = createMemoryRouter(routes, {
      initialEntries: ["/items/999"],
    });
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={errorRouter} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("ItemNotFound")).toBeInTheDocument();
    });
  });
  test("navigates back to inventory when button is clicked", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Test Item")).toBeInTheDocument();
    });
    const backButton = screen.getByText("Back to inventory");
    expect(router.state.location.pathname).toBe("/items/1");
    act(() => {
      fireEvent.click(backButton);
    });
    //expect(mockNavigate).toHaveBeenCalledWith("/items");
    expect(router.state.location.pathname).toBe("/items");
  });
});
