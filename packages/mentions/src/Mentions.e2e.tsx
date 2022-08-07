import { expect, test } from "@playwright/experimental-ct-react";
import TestComponent from "./MentionsPlayground.tc";

test.use({ viewport: { width: 500, height: 500 } });

test("should render a mention", async ({ mount }) => {
  const component = await mount(<TestComponent initialValue="Hello @John" />);
  const element = component.locator('[data-testid="mention-John"]');
  await expect(element).toContainText("John");
});

test("should open the mention combobox by typing a trigger key", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus />);
  const editor = component.locator("data-testid=fe");
  await expect(
    page.locator('[data-testid="fe-mention-combobox"]')
  ).not.toBeVisible();
  await editor.type("@");
  await expect(
    page.locator('[data-testid="fe-mention-combobox"]')
  ).toBeVisible();
});

test("should open the mention combobox by clicking on a button", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus />);
  await expect(
    page.locator('[data-testid="fe-mention-combobox"]')
  ).not.toBeVisible();
  await component.locator('[data-testid="fe-open-mentions"]').click();
  await expect(
    page.locator('[data-testid="fe-mention-combobox"]')
  ).toBeVisible();
  await expect(page.locator('[data-testid="fe-editor-value"]')).toContainText(
    "@"
  );
});

test("should select a mention when pressing the enter key", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus />);
  const editor = component.locator("data-testid=fe");
  await editor.type("@");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-testid="fe-editor-value"]')).toContainText(
    "@Jane"
  );
});

test("should select a mention when clicking on a list item", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus />);
  await component.locator('[data-testid="fe-open-mentions"]').click();
  await page.locator('[data-testid="fe-mention-combobox-item-Jane"]').click();
  await expect(page.locator('[data-testid="fe-editor-value"]')).toContainText(
    "@Jane"
  );
});
