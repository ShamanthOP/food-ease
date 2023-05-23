import React from "react";
import { configure, shallow } from "enzyme";
import CategoryDropdown from "./CategoryDropdown";
import { EnzymeAdapter } from "enzyme";

configure({ adapter: new EnzymeAdapter() });

describe("CategoryDropdown", () => {
    test("matches snapshot", () => {
        const wrapper = shallow(<CategoryDropdown />);
        expect(wrapper).toMatchSnapshot();
    });
});
