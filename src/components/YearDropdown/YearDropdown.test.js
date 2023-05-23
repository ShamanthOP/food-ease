import React from "react";
import { configure, shallow } from "enzyme";
import YearDropdown from "./YearDropdown";
import { EnzymeAdapter } from "enzyme";

configure({ adapter: new EnzymeAdapter() });

describe("YearDropdown", () => {
    test("matches snapshot", () => {
        const wrapper = shallow(<YearDropdown />);
        expect(wrapper).toMatchSnapshot();
    });
});
