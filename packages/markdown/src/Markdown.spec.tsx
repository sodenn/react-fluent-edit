import { expect, test } from "@playwright/experimental-ct-react";
import TestComponent from "./Markdown.tc";

test.use({ viewport: { width: 500, height: 500 } });

const markerColor = "rgb(119, 119, 119)";

test("should not render multiline heading element", async ({ mount, page }) => {
  const component = await mount(<TestComponent initialValue="# x" />);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await page.keyboard.press("Enter");
  await component.type("x");
  await expect(
    component.locator('[data-slate-leaf="true"][style]')
  ).toHaveCount(2);
  await expect(component.locator('[data-slate-leaf="true"]')).toHaveCount(3);
});

test("should render a heading element", async ({ mount }) => {
  const component = await mount(<TestComponent initialValue="# Heading" />);

  const marker = component.locator(
    '[data-slate-leaf="true"] > span:has-text("#")'
  );
  const heading = component.locator(
    '[data-slate-leaf="true"] > span:has-text("Heading")'
  );

  await expect(marker).toHaveCSS("color", markerColor);
  await expect(heading).not.toHaveCSS("color", markerColor);
  await expect(heading).toHaveCSS("font-weight", "700");
});

test("should remove heading element", async ({ mount, page }) => {
  const component = await mount(<TestComponent initialValue="# x" />);

  const marker = component.locator(
    '[data-slate-leaf="true"] > span:has-text("#")'
  );
  const heading = component.locator(
    '[data-slate-leaf="true"] > span:has-text("x")'
  );

  await expect(marker).toHaveCSS("color", markerColor);
  await expect(heading).toBeVisible();

  await page.keyboard.press("Backspace");
  await page.keyboard.press("Backspace");
  await page.keyboard.press("x");

  await expect(marker).not.toHaveCSS("color", markerColor);
});

test("should add heading element", async ({ mount }) => {
  const component = await mount(<TestComponent initialValue="" />);

  await component.type("# x");

  const marker = component.locator(
    '[data-slate-leaf="true"] > span:has-text("#")'
  );
  const heading = component.locator(
    '[data-slate-leaf="true"] > span:has-text("x")'
  );

  await expect(marker).toHaveCSS("color", markerColor);
  await expect(heading).toBeVisible();
});

test("should combine heading element with bold text", async ({ mount }) => {
  const component = await mount(<TestComponent initialValue="# **x**" />);
  const markers = component.locator(
    '[data-slate-leaf="true"]:nth-child(3), [data-slate-leaf="true"]:nth-child(5)'
  );
  const text = component.locator('[data-slate-leaf="true"]:nth-child(4)');
  await expect(text).toBeVisible();
  await expect(markers).toHaveCount(2);
});

test("should automatically increment a numbered list item", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent initialValue="" />);
  await component.type("1. Aaa");
  await page.keyboard.press("Enter");
  await expect(component.locator('[data-slate-editor="true"]')).toContainText(
    "1. Aaa2."
  );
});

test("should correctly number a list item after indenting", async ({
  mount,
  page,
}) => {
  const component = await mount(
    <TestComponent initialValue="1. Aaa\n2. Bbb" />
  );
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(component.locator('[data-slate-editor="true"]')).toContainText(
    "1. Aaa   1. Bbb"
  );
});
