import { expect, test } from "@playwright/experimental-ct-react";
import TestComponent from "./MuiFluentEdit.tc";

test.use({ viewport: { width: 500, height: 500 } });

test("should render a mention", async ({ mount }) => {
  const component = await mount(<TestComponent />);
  await expect(component).toContainText("Start typing");
});
