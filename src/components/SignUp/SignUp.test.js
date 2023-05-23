import React from "react";
import { shallow, configure } from "enzyme";
import SignUp from "./SignUp";
import { EnzymeAdapter } from "enzyme";

configure({ adapter: new EnzymeAdapter() });
describe("SignUp", () => {
    test("matches snapshot", () => {
        const wrapper = shallow(<SignUp />);
        expect(wrapper).toMatchSnapshot();
    });
});
