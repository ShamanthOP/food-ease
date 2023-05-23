import React from "react";
import { shallow, configure } from "enzyme";
import WeekDropdown from "./WeekDropdown";
import { EnzymeAdapter } from "enzyme";

configure({ adapter: new EnzymeAdapter() });

describe("WeekDropdown", () => {
    test("matches snapshot", () => {
        const wrapper = shallow(<WeekDropdown />);
        expect(wrapper).toMatchSnapshot();
    });
});
