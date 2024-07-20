import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
//import "@testing-library/jest-dom/extend-expect";
import SearchField from "../components/SearchField";

describe("SearchField Component", () => {
  test("renders correctly and calls function on debounce", async () => {
    const searchFnMock = jest.fn();

    render(<SearchField searchFn={searchFnMock} />);

    const input = screen.getByLabelText("Search") as HTMLInputElement;

    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "test" } });
    expect(input.value).toBe("test");

    await waitFor(() => {
      expect(searchFnMock).toHaveBeenCalledWith("test");
    });
  });

  test("calls searchFn immediately on Enter key press", () => {
    const searchFnMock = jest.fn();

    render(<SearchField searchFn={searchFnMock} />);

    const input = screen.getByLabelText("Search") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "immediate" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(searchFnMock).toHaveBeenCalledWith("immediate");
  });
});
