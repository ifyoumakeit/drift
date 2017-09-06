import React from "react";
import Drift from "../../dist/Drift";
import glamorous from "glamorous";

// Arbitrary styled components.
const Wrapper = glamorous.div({
  textAlign: "center",
  backgroundColor: "#333"
});

const SlideWithCaption = glamorous.div({ position: "relative" });

const Caption = glamorous.div({
  position: "absolute",
  backgroundColor: "black",
  color: "white",
  top: "12px",
  left: "12px",
  padding: "6px"
});

const Dots = glamorous.div({
  width: "80%"
});

const Dot = glamorous.button(
  {
    borderRadius: "50%",
    outline: 0,
    border: 0,
    width: "12px",
    height: "12px",
    display: "inline-block",
    verticalAlign: "middle",
    margin: "0 6px",
    cursor: "pointer"
  },
  ({ isActive }) => ({
    backgroundColor: isActive ? "red" : "black"
  })
);

const Header = glamorous.header({
  padding: "12px"
});

const Heading = glamorous.h1({
  margin: 0,
  fontSize: "20px",
  color: "#fff"
});

const Button = glamorous.button(
  {
    height: "40px",
    width: "20%",
    color: "white",
    cursor: "pointer",
    border: 0,
    fontSize: "30px",
    verticalAlign: "middle",
    display: "inline-block",
    lineHeight: "30px"
  },
  ({ isLeft, isRight, disabled }) => ({
    backgroundColor: disabled ? "#ccc" : "#444",
    "&:hover": {
      backgroundColor: disabled ? "#ccc" : "#333"
    }
  })
);

const Footer = glamorous.footer({
  backgroundColor: "#efefef",
  padding: "12px",
  display: "flex",
  alignItems: "center"
});

export default () => (
  <Drift>
    {({
      propsContainer,
      propsSlide,
      propsSlides,
      goToSlide,
      index,
      indexLast
    }) => (
      <Wrapper>
        <Header>
          <Heading children={`Slide ${index + 1} / ${indexLast + 1}`} />
        </Header>

        <main {...propsContainer()}>
          <div {...propsSlides()}>
            <SlideWithCaption {...propsSlide("splash")}>
              <Caption>My cool caption</Caption>
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
            </SlideWithCaption>

            <div {...propsSlide("phone")}>
              <img
                alt="Looking at phone"
                src="https://unsplash.it/400/300?image=3"
                width="100%"
              />
            </div>

            <div {...propsSlide("notes")}>
              <img
                alt="Taking notes with computer"
                src="https://unsplash.it/400/300?image=4"
                width="100%"
              />
            </div>

            <div {...propsSlide("typing")}>
              <img
                alt="Typing at computer with closed notebook"
                src="https://unsplash.it/400/300?image=5"
                width="100%"
              />
            </div>

            <div {...propsSlide("final")}>
              <img
                alt="Computer with empty glass to the left"
                src="https://unsplash.it/400/300?image=6"
                width="100%"
              />
            </div>
          </div>
        </main>

        <Footer>
          <Button
            type="button"
            isLeft
            onClick={() => goToSlide(index - 1)}
            disabled={index === 0}
            children="‹"
          />
          <Dots>
            {[...Array(indexLast + 1)].map((v, i) => (
              <Dot
                type="button"
                key={i}
                isActive={index === i}
                onClick={() => goToSlide(i)}
              />
            ))}
          </Dots>
          <Button
            type="button"
            isRight
            onClick={() => goToSlide(index + 1)}
            disabled={index >= indexLast}
            children="›"
          />
        </Footer>
      </Wrapper>
    )}
  </Drift>
);
