import React from "react";
import { mount } from "enzyme";
import Drift from "../";

test("goToSlide will change index", () => {
  const { Component, childSpy } = setup();
  const wrapper = mount(<Component />);
  const button = wrapper.find("button");
  expect(childSpy).toHaveBeenLastCalledWith(expect.objectContaining({ index: 0 }));
  button.simulate("click");
  expect(childSpy).toHaveBeenLastCalledWith(expect.objectContaining({ index: 1 }));
});

test("goToSlide can increment index until max", () => {
  const { Component, childSpy } = setup();
  const wrapper = mount(<Component />);
  const button = wrapper.find("button");
  expect(childSpy).toHaveBeenLastCalledWith(expect.objectContaining({ index: 0 }));
  button.simulate("click");
  expect(childSpy).toHaveBeenLastCalledWith(expect.objectContaining({ index: 1 }));
});

function setup() {
  const childSpy = jest.fn(({ goToSlide, index, propsContainer, propsSlides, propsSlide }) => (
    <div>
      <div {...propsContainer()}>
        <div {...propsSlides()}>
          <div {...propsSlide("one")} />
          <div {...propsSlide("two")} />
        </div>
      </div>

      <button onClick={() => goToSlide(2)}>Go to {index}</button>
      <button onClick={() => goToSlide(index + 1)}>Increment</button>
    </div>
  ));
  return {
    Component: () => <Drift>{childSpy}</Drift>,
    childSpy
  };
}
