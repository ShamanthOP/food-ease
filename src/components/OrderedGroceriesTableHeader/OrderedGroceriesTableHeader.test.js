import React from "react";
import { configure, shallow } from "enzyme";
import OrderedGroceriesTableHeader from "./OrderedGroceriesTableHeader";
import { EnzymeAdapter } from "enzyme";

configure({ adapter: new EnzymeAdapter() });

describe("OrderedGroceriesTableHeader", () => {
    test("matches snapshot", () => {
        const wrapper = shallow(<OrderedGroceriesTableHeader />);
        expect(wrapper).toMatchSnapshot();
    });
});
