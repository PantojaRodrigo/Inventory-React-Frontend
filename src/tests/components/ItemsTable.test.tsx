import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ItemsTable from "../../components/ItemsTable";
import Item, { Location } from "../../interfaces/Item";
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

describe("ItemsTable", () => {
  const handleDeleteItem = jest.fn();

  beforeEach(() => {
    render(
      <Router>
        <ItemsTable
          items={mockItems}
          handleDeleteItem={handleDeleteItem}
          loading={false}
        />
      </Router>
    );
  });

  test("renders the table with items", () => {
    mockItems.slice(0, 5).forEach((item) => {
      expect(screen.getByText(item.itemId)).toBeInTheDocument();
      expect(screen.getByText(item.itemName)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });

  test("renders pagination controls", () => {
    expect(screen.getByLabelText("first page")).toBeInTheDocument();
    expect(screen.getByLabelText("previous page")).toBeInTheDocument();
    expect(screen.getByLabelText("next page")).toBeInTheDocument();
    expect(screen.getByLabelText("last page")).toBeInTheDocument();
  });

  test("navigates to item detail on row click", () => {
    const itemCell = screen.getByText(mockItems[0].itemId);
    act(() => {
      fireEvent.click(itemCell);
    });
    expect(window.location.pathname).toBe(`/${mockItems[0].itemId}`);
  });

  test("opens modal on delete button click", () => {
    const deleteButton = screen.getAllByLabelText("delete")[0];
    act(() => {
      fireEvent.click(deleteButton);
    });
    expect(handleDeleteItem).toHaveBeenCalledWith(mockItems[0].itemId);
  });

  test("changes page on pagination button click", () => {
    const nextPageButton = screen.getByLabelText("next page");
    act(() => {
      fireEvent.click(nextPageButton);
    });

    mockItems.slice(5, 6).forEach((item) => {
      expect(screen.getByText(item.itemId)).toBeInTheDocument();
      expect(screen.getByText(item.itemName)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });

  test("changes rows per page", () => {
    const rowsPerPageSelect = screen.getByLabelText("items per page");
    fireEvent.change(rowsPerPageSelect, { target: { value: "10" } });

    mockItems.forEach((item) => {
      expect(screen.getByText(item.itemId)).toBeInTheDocument();
      expect(screen.getByText(item.itemName)).toBeInTheDocument();
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });
});
