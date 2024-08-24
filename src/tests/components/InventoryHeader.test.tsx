import React, { act } from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
//import "@testing-library/jest-dom/extend-expect";
import {
  createMemoryRouter,
  BrowserRouter as Router,
  RouterProvider,
} from "react-router-dom";
import InventoryHeader from "../../components/InventoryHeader";
import {MockedProvider} from "@apollo/client/testing";
import SearchField from "../../components/SearchField";
import {FiltersProps} from "../../pages/Inventory";
import {GET_STATES} from "../../queries";


jest.mock("../../components/SearchField", () => () => <div>SearchField</div>);

const apolloMocks = [
  {
    request: {
      query: GET_STATES,
    },
    result: {
      data: {
        states: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California'],
      },
    },
  },
];

describe("InventoryHeader component", () => {
  const filters = {id:'', name:'', state:''}
  const setFilters = jest.fn();

  test("displays the number of items when queryLoading is false", () => {
    render(
      <Router>
        <MockedProvider>
          <InventoryHeader
            itemsLength={5}
            queryLoading={false}
            filters={{id:"", name:"", state:""}}
            setFilters={setFilters}
          />
        </MockedProvider>
      </Router>
    );

    const itemsText = screen.getByText(/Showing 5 items/i);
    expect(itemsText).toBeInTheDocument();
  });

  test("does not display the number of items when queryLoading is true", () => {
    render(
      <Router>
        <MockedProvider>
          <InventoryHeader
            itemsLength={5}
            queryLoading={true}
            filters={filters}
            setFilters={setFilters}
          />
        </MockedProvider>
      </Router>
    );

    const itemsText = screen.queryByText(/Showing 5 items/i);
    expect(itemsText).not.toBeInTheDocument();
  });

  test("renders the SearchField component", async() => {
    const routes = [
      {
        path: "/",
        element: (
          <InventoryHeader
            itemsLength={5}
            queryLoading={false}
            filters={filters}
            setFilters={setFilters}
          />
        ),
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(
      <MockedProvider mocks={apolloMocks} addTypename={false}>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    act(() => {
        fireEvent.click(screen.getByRole("button", { name: /filter/i }));
    })
    const idSearch = await screen.findByRole('searchbox', {name: 'id'});
    const nameSearch = await screen.findByRole('searchbox', {name: 'name'});
    const stateSearch = await screen.findByRole('combobox');
    expect(idSearch).toBeInTheDocument();
    expect(nameSearch).toBeInTheDocument();
    expect(stateSearch).toBeInTheDocument();
  });

  test("renders the add button with a link to newItem", () => {
    const routes = [
      {
        path: "/",
        element: (
          <InventoryHeader
            itemsLength={5}
            queryLoading={false}
            filters={filters}
            setFilters={setFilters}
          />
        ),
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/"],
    });
    render(
      <MockedProvider>
        <RouterProvider router={router} />
      </MockedProvider>
    );

    const addButton = screen.getByRole("button", { name: /add/i });
    expect(addButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(addButton);
    });
    expect(router.state.location.pathname).toBe("/newItem");
  });
});
