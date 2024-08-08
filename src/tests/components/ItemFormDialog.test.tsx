import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ItemFormDialog from "../../components/ItemFormDialog"; // Asegúrate de que la ruta sea correcta
import userEvent from "@testing-library/user-event";
describe("ItemFormDialog", () => {
  const mockHandleModalClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dialog when modalOpen is true", () => {
    render(
      <Router>
        <ItemFormDialog
          modalOpen={true}
          handleModalClose={mockHandleModalClose}
        />
      </Router>
    );

    expect(
      screen.getByText("Do you want to keep adding items?")
    ).toBeInTheDocument();
  });

  it("does not render the dialog when modalOpen is false", () => {
    const { queryByText } = render(
      <Router>
        <ItemFormDialog
          modalOpen={false}
          handleModalClose={mockHandleModalClose}
        />
      </Router>
    );

    expect(queryByText("Do you want to keep adding items?")).toBeNull();
  });

  it('calls handleModalClose when "Yes" button is clicked', () => {
    render(
      <Router>
        <ItemFormDialog
          modalOpen={true}
          handleModalClose={mockHandleModalClose}
        />
      </Router>
    );

    fireEvent.click(screen.getByText("Yes"));
    expect(mockHandleModalClose).toHaveBeenCalledTimes(1);
  });

  it("renders a link to the inventory page", () => {
    render(
      <Router>
        <ItemFormDialog
          modalOpen={true}
          handleModalClose={mockHandleModalClose}
        />
      </Router>
    );

    const link = screen.getByRole("link", { name: /No, go to inventory/i });
    expect(link).toHaveAttribute("href", "/items");
  });

  test("calls handleModalClose when clicking outside the dialog", () => {
    render(
      <Router>
        <ItemFormDialog
          modalOpen={true}
          handleModalClose={mockHandleModalClose}
        />
      </Router>
    );

    act(() => {
      userEvent.click(document.body);
    });

    expect(mockHandleModalClose).toHaveBeenCalledTimes(1);
  });
  it("calls handleModalClose when pressing 'Esc'", () => {
    const mockHandleModalClose = jest.fn();
    const renderResult = render(
      <Router>
        <ItemFormDialog
          modalOpen={true}
          handleModalClose={mockHandleModalClose}
        />
      </Router>
    );

    act(() => {
      fireEvent.keyDown(document.body, { key: "Escape", code: "Escape" });
    });

    expect(mockHandleModalClose).toHaveBeenCalledTimes(1);
  });
});
