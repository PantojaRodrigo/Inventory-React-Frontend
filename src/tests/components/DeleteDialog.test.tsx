import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
//import "@testing-library/jest-dom/extend-expect";
import DeleteDialog from "../../components/DeleteDialog";

describe("DeleteDialog component", () => {
  const onCloseMock = jest.fn();
  const onDeleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dialog with correct text", () => {
    render(
      <DeleteDialog open={true} onClose={onCloseMock} onDelete={onDeleteMock} />
    );

    expect(
      screen.getByText("Are you sure you want to delete this item?")
    ).toBeInTheDocument();
  });

  test("calls onClose when 'No' button is clicked", () => {
    render(
      <DeleteDialog open={true} onClose={onCloseMock} onDelete={onDeleteMock} />
    );

    fireEvent.click(screen.getByText("No"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("calls onDelete when Yes button is clicked", () => {
    render(
      <DeleteDialog open={true} onClose={onCloseMock} onDelete={onDeleteMock} />
    );

    fireEvent.click(screen.getByText("Yes"));
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  test("dialog is not visible when open is false", () => {
    render(
      <DeleteDialog
        open={false}
        onClose={onCloseMock}
        onDelete={onDeleteMock}
      />
    );

    expect(
      screen.queryByText("Are you sure you want to delete this item?")
    ).not.toBeInTheDocument();
  });
});
