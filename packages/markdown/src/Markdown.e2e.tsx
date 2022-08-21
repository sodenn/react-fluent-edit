import { expect, test } from "@playwright/experimental-ct-react";
import MarkdownPlayground from "./MarkdownPlayground.tc";

test.use({ viewport: { width: 500, height: 500 } });

const markerColor = "rgb(119, 119, 119)";

test("should render a heading element", async ({ mount }) => {
  const component = await mount(
    <MarkdownPlayground initialValue="# Heading" />
  );

  const heading = component.locator("h1");
  await expect(heading).toContainText("# Heading");

  const marker = heading.locator('span:has-text("#") >> nth=1');
  const text = heading.locator('span:has-text("Heading") >> nth=1');

  await expect(marker).toHaveCSS("color", markerColor);
  await expect(text).not.toHaveCSS("color", markerColor);
});

test("should remove heading element", async ({ mount, page }) => {
  const component = await mount(<MarkdownPlayground initialValue="# x" />);

  const marker = component.locator('span:has-text("#") >> nth=1');
  const heading = component.locator("h1");

  await expect(marker).toHaveCSS("color", markerColor);
  await expect(heading).toBeVisible();

  await page.keyboard.press("Backspace");

  await expect(heading).not.toBeVisible();
  await expect(marker).not.toHaveCSS("color", markerColor);
});

test("should add heading element", async ({ mount }) => {
  const component = await mount(<MarkdownPlayground initialValue="" />);

  await component.type("# x");

  const marker = component.locator('span:has-text("#") >> nth=1');
  const heading = component.locator("h1");

  await expect(marker).toHaveCSS("color", markerColor);
  await expect(heading).toBeVisible();
});

test("should combine heading element with bold text", async ({ mount }) => {
  const component = await mount(<MarkdownPlayground initialValue="# **x**" />);
  const boldText = component.locator('span:has-text("**x**") >> nth=1');
  await expect(boldText).toBeVisible();
});

test("should not render multiline heading element", async ({ mount, page }) => {
  const component = await mount(<MarkdownPlayground initialValue="# x" />);
  await page.keyboard.press("Enter");
  await component.type("x");
  const heading = component.locator("h1");
  await expect(heading).toHaveCount(1);
});
