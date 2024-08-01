import { act, render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import {
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
} from "react-router-dom";
import UpdateItem from "../../pages/UpdateItem";
import { GET_ITEM } from "../../queries";
import { ApolloError } from "@apollo/client";
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
const router = createMemoryRouter(
  [
    {
      path: "/:itemId/newItem",
      element: <UpdateItem />,
    },
  ],
  {
    initialEntries: ["/1/newItem"],
  }
);
jest.mock("../../pages/ApolloErrorPage", () => () => <div>Error</div>);
jest.mock("../../components/NoItemFound", () => () => <div>ItemNotFound</div>);
jest.mock("../../components/ItemForm", () => () => <div>ItemForm</div>);
describe("ItemDetail component", () => {
  test("should display CircularProgress while loading", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("should Error page when there is an error", async () => {
    const errorMocks = [
      {
        request: {
          query: GET_ITEM,
          variables: { id: 1 },
        },
        error: new ApolloError({
          errorMessage: "An error ocurred",
          networkError: new Error("NetworkError"),
        }),
        result: {
          data: {
            item: null,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    //expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });
  });

  test("should render ItemForm with item data", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("ItemForm")).toBeInTheDocument();
    });
  });

  const noItemMocks = [
    {
      request: {
        query: GET_ITEM,
        variables: { id: 1 },
      },
      error: new ApolloError({
        errorMessage: "No item found",
      }),
      result: {
        data: {
          item: null,
        },
      },
    },
  ];
  test("should render NoItemFound when no item is found", async () => {
    render(
      <MockedProvider mocks={noItemMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("ItemNotFound")).toBeInTheDocument();
    });
  });
});
