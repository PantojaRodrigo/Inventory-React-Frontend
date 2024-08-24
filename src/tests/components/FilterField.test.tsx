import React, {act, useState} from "react";
import {render, fireEvent, screen, waitFor} from "@testing-library/react";
//import "@testing-library/jest-dom/extend-expect";
import FilterField from "../../components/FilterField";
import userEvent from "@testing-library/user-event";


describe("FilterField Component", () => {
    const onChangeMock = jest.fn();

    test("renders correctly as a searchbox and combobox", async () => {

        render(
            <>
                <FilterField value="" onChange={onChangeMock} name="testSearch" label="testingSearchBox"/>
                <FilterField value="" onChange={onChangeMock} options={[]} name="testCombo" label="testingComboBox"/>
            </>
        );

        const searchBox = screen.getByRole("searchbox", {name: 'testSearch'});
        expect(searchBox).toBeInTheDocument();

        const combobox = screen.getByRole("combobox", {name: 'testingComboBox testCombo'});
        expect(combobox).toBeInTheDocument();
    });

    test("onChange is called when the input is changed", async () => {
        const TestComponent = ()=>{
            const [searchValue, setSearchValue] = useState("");
            const [comboValue, setComboValue] = useState("");
            const handleChange = (mockEvent: React.ChangeEvent<HTMLInputElement>, setValue: React.Dispatch<React.SetStateAction<string>>) => {
                setValue(mockEvent.target.value);
            }
            return (
                <>
                    <FilterField
                        value={searchValue}
                        onChange={(e) => handleChange(e, setSearchValue)}
                        name="testSearch"
                        label="testingSearchBox"/>
                    <FilterField
                        value={comboValue}
                        onChange={(e) => handleChange(e, setComboValue)}
                        options={["option1"]}
                        name="testCombo"
                        label="testingComboBox"/>
                </>
            )
        }

        render(
            <TestComponent/>
        );
        const searchBox = screen.getByRole("searchbox", {name: 'testSearch'});
        await userEvent.type(searchBox, "search");

        const combobox = screen.getByRole("combobox", {name: 'testingComboBox testCombo'});
        userEvent.click(combobox);

        const option1 = await screen.findByText('option1');
        userEvent.click(option1);

        await waitFor(() => {
            expect(searchBox).toHaveValue("search");
            expect(combobox).toHaveTextContent('option1');
        });
    });
});
