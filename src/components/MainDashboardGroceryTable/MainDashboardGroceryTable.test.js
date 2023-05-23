import React from "react";
import { configure, shallow } from "enzyme";
import MainDashboardGroceryTable from "./MainDashboardGroceryTable";
import { EnzymeAdapter } from "enzyme";

configure({ adapter: new EnzymeAdapter() });

describe("MainDashboardGroceryTable", () => {
    test("matches snapshot", () => {
        const wrapper = shallow(<MainDashboardGroceryTable />);
        expect(wrapper).toMatchSnapshot();
    });
});
