import React from "react";
import Drift from "../../src/Drift";

export default () => (
  <Drift
    indexDidUpdate={(prevIndex, nextIndex) =>
      console.log(`${prevIndex} changed to ${nextIndex}`)}
  >
    {({
      propsContainer,
      propsSlide,
      propsSlides,
      goToSlide,
      index,
      indexLast
    }) => (
      <div>
        <header>
          <h1 children={`Slide ${index + 1} / ${indexLast + 1}`} />
        </header>

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

        <footer>
          <button
            type="button"
            onClick={() => goToSlide(index - 1)}
            
            children="Previous"
          />
          {[...Array(indexLast + 1)].map((v, i) => (
            <div
              type="button"
              key={i}
              style={{
                backgroundColor: index === i ? "red" : "black",
                width: "10px",
                height: "10px",
                display: "inline-block",
                margin: "0 4px"
              }}
              onClick={() => goToSlide(i)}
            />
          ))}
          <button
            type="button"
            onClick={() => goToSlide(index + 1)}
            
            children="Next"
          />
        </footer>
      </div>
    )}
  </Drift>
);
