import React from "react";
import { configure, storiesOf } from "@storybook/react";

import { Advanced, Basic, Glamorous } from "./examples";

function loadStories() {
  console.clear();

  storiesOf("Examples", module)
    .add("basic", () => <Basic />)
    .add("advanced", () => <Advanced />)
    .add("glamorous", () => <Glamorous />);
}

configure(loadStories, module);
