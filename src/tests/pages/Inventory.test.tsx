import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import Inventory from "../../pages/Inventory";
import { GET_ITEMS_WITH_SEARCH } from "../../queries";
import { useSearch } from "../../hooks/useSearch";
import { useDeleteItem } from "../../hooks/useDeleteItem";
import Item, { Location } from "../../interfaces/Item";
import { ApolloError } from "@apollo/client";
import { GraphQLError } from "graphql";

jest.mock("../../hooks/useSearch", () => ({
  useSearch: jest.fn(),
}));

jest.mock("../../hooks/useDeleteItem", () => ({
  useDeleteItem: jest.fn(),
}));
jest.mock("../../components/ItemsTable", () => ({
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
interface InventoryHeaderProps {
  itemsLength: number;
  queryLoading: boolean;
  search: (str: string) => void;
}
jest.mock("../../components/InventoryHeader", () => ({
  __esModule: true,
  default: ({ itemsLength, queryLoading, search }: InventoryHeaderProps) => (
    <div>InventoryHeader</div>
  ),
}));

jest.mock("../../components/DeleteDialog", () => () => <div>DeleteDialog</div>);
jest.mock("../../components/InventorySnackbar", () => () => (
  <div>InventorySnackbar</div>
));
jest.mock("../../components/NoItems", () => () => <div>NoItems</div>);
jest.mock("../../pages/ApolloErrorPage", () => () => <div>Error</div>);
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
];

describe("Inventory Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSearch as jest.Mock).mockReturnValue({
      searchValue: "",
      search: jest.fn(),
    });
    (useDeleteItem as jest.Mock).mockReturnValue({
      modalOpen: 0,
      snackOpen: false,
      handleModalClose: jest.fn(),
      handleModalOpen: jest.fn(),
      handleDeleteItem: jest.fn(),
      handleSnackClose: jest.fn(),
      error: null,
    });
  });

  it("Should render Inventory  without crashing ", () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Inventory />
      </MockedProvider>
    );
    expect(screen.getByText(/InventoryHeader/i)).toBeInTheDocument();
  });

  it("should display NoItems component when there are no items and search is empty", async () => {
    const mocks = [
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
      <MockedProvider mocks={mocks} addTypename={false}>
        <Inventory />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/NoItems/i)).toBeInTheDocument();
    });
  });

  it("should display ItemsTable component when there are items", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Inventory />
      </MockedProvider>
    );
    expect(screen.getByText(/InventoryHeader/i)).toBeInTheDocument();
    expect(screen.getByText(/ItemsTable/i)).toBeInTheDocument();
  });

  it("should show ApolloErrorPage on error", async () => {
    jest.clearAllMocks();
    (useSearch as jest.Mock).mockReturnValue({
      searchValue: "",
      search: jest.fn(),
    });
    (useDeleteItem as jest.Mock).mockReturnValue({
      modalOpen: 0,
      snackOpen: false,
      handleModalClose: jest.fn(),
      handleModalOpen: jest.fn(),
      handleDeleteItem: jest.fn(),
      handleSnackClose: jest.fn(),
      error: null,
    });
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
        result: {
          data: null,
        },
      },
    ];
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <Inventory />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });
  });
});
