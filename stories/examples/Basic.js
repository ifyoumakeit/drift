import React from "react";
import Drift from "../../dist/Drift";

export default () => (
  <Drift>
    {({ propsContainer, propsSlide, propsSlides }) => (
      <main {...propsContainer()}>
        <div {...propsSlides()}>
          <div {...propsSlide("first")}>
            <img
              alt="Typing at table"
              src="https://unsplash.it/200/300?image=1"
              width="50%"
            />
            <img
              alt="Computer with coffee"
              src="https://unsplash.it/200/300?image=2"
              width="50%"
            />
          </div>

          <div {...propsSlide("second")}>
            <img
              alt="Looking at phone"
              src="https://unsplash.it/400/300?image=3"
              width="100%"
            />
          </div>

          <div {...propsSlide("last")}>
            <img
              alt="Taking notes with computer"
              src="https://unsplash.it/400/300?image=4"
              width="100%"
            />
          </div>
        </div>
      </main>
    )}
  </Drift>
);
