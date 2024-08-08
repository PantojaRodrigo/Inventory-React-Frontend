import { render, screen, fireEvent } from "@testing-library/react";
import {
  createMemoryRouter,
  MemoryRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Navbar from "../../pages/Navbar";

jest.mock("../../Netlogistik_Logo_Positivo.png", () => "mocked-logo.png");

const FakeComponent = () => <div>fake text</div>;
const router = createMemoryRouter(
  [
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          path: "/",
          element: <FakeComponent />,
        },
      ],
    },
    {
      path: "/items",
      element: <div>Items Page</div>,
    },
  ],
  {
    initialEntries: ["/"],
  }
);
describe("Navbar Component", () => {
  test("renders logo and navigation items for larger screens", () => {
    render(<RouterProvider router={router} />);
    expect(screen.getByAltText("Logo-md")).toBeInTheDocument();

    expect(screen.getByLabelText(/Inventory-button/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Login-button/i)).toBeInTheDocument();
  });

  test("renders menu button and menu items for smaller screens", () => {
    const resizeWindow = (width: number) => {
      window.innerWidth = width;
      window.dispatchEvent(new Event("resize"));
    };
    render(<RouterProvider router={router} />);

    resizeWindow(500);
    expect(screen.getByLabelText("menu-appbar")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("menu-appbar"));

    expect(screen.getByLabelText(/Inventory-menu-item/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Login-menu-item/i)).toBeInTheDocument();
  });

  test("renders the Outlet component", () => {
    render(<RouterProvider router={router} />);

    expect(screen.getByText("fake text")).toBeInTheDocument();
  });

  test("navigates to /items when Inventory button is clicked", () => {
    render(<RouterProvider router={router} />);

    expect(screen.queryByText("Items Page")).toBeNull();

    fireEvent.click(screen.getByLabelText(/Inventory-button/i));

    expect(screen.getByText("Items Page")).toBeInTheDocument();
  });
});
