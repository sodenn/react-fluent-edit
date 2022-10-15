import { expect, test } from "@playwright/experimental-ct-react";
import TestComponent from "./Mentions.stage";

test.use({ viewport: { width: 500, height: 500 } });

test("should render a mention", async ({ mount }) => {
  const component = await mount(
    <TestComponent openSections initialValue="Hello @John" />
  );
  const element = component.locator('[data-testid="mention-John"]');
  await expect(element).toContainText("John");
});

test("should open the mention combobox by typing a trigger key", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  const editor = component.locator("data-testid=rfe");
  await expect(
    page.locator('[data-testid="rfe-mention-combobox"]')
  ).not.toBeVisible();
  await editor.type("@");
  await expect(
    page.locator('[data-testid="rfe-mention-combobox"]')
  ).toBeVisible();
  await expect(
    page.locator('[data-testid="rfe-mention-combobox-item-Jane"]')
  ).toContainText("Jane");
  await expect(
    page.locator('[data-testid="rfe-mention-combobox-item-John"]')
  ).toContainText("John");
});

test("should open the mention combobox by clicking on a button", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  await expect(
    page.locator('[data-testid="rfe-mention-combobox"]')
  ).not.toBeVisible();
  await component.locator('[data-testid="rfe-open-mentions"]').click();
  await expect(
    page.locator('[data-testid="rfe-mention-combobox"]')
  ).toBeVisible();
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("@");
});

test("should select a mention when pressing the enter key", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  const editor = component.locator("data-testid=rfe");
  await editor.type("@");
  await page.keyboard.press("ArrowDown", { delay: 10 });
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-testid="rfe-editor-value"]')).toContainText(
    "@Jane"
  );
});

test("should select a mention when clicking on a list item", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  await component.locator('[data-testid="rfe-open-mentions"]').click();
  await page.locator('[data-testid="rfe-mention-combobox-item-Jane"]').click();
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("@Jane");
});

test("should add a mention from outside of the editor", async ({ mount }) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  await component.locator('[data-testid="rfe-mention-to-add"]').type("Test");
  await component.locator('[data-testid="rfe-add-mention"]').click();
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("@Test");
});

test("should remove a mention from outside of the editor", async ({
  mount,
}) => {
  const component = await mount(
    <TestComponent
      autoFocus
      openSections
      initialValue="This is a @Small @Test"
    />
  );
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("This is a @Small @Test");
  await component.locator('[data-testid="rfe-mention-to-remove"]').type("Test");
  await component.locator('[data-testid="rfe-remove-mention"]').click();
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("This is a @Small");
});

test("should remove all mention from outside of the editor", async ({
  mount,
  page,
}) => {
  const component = await mount(
    <TestComponent autoFocus openSections initialValue="@A @B #C" />
  );
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("@A @B #C");
  await page.selectOption('[data-testid="rfe-trigger-select"]', "@");
  await component.locator('[data-testid="rfe-remove-mention"]').click();
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("#C");
});

test("should rename a mention", async ({ mount, page }) => {
  const component = await mount(
    <TestComponent autoFocus openSections initialValue="@Hello #World" />
  );
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("@Hello #World");
  await page.selectOption('[data-testid="rfe-trigger-select"]', "#");
  await component
    .locator('[data-testid="rfe-mention-to-rename-filter"]')
    .type("World");
  await component
    .locator('[data-testid="rfe-mention-to-rename-value"]')
    .type("Test");
  await component.locator('[data-testid="rfe-rename-mentions"]').click();
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("@Hello #Test");
});

test("should add a mention when focus is lost", async ({ mount }) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  await component.locator("data-testid=rfe").type("@www");
  await component.locator("data-testid=rfe").evaluate((e) => e.blur());
  await expect(component.locator('[data-testid="mention-www"]')).toContainText(
    "@www"
  );
});

test("should automatically insert a space after a mention", async ({
  mount,
}) => {
  const component = await mount(
    <TestComponent autoFocus openSections initialValue="@Hello" />
  );
  await component.locator("data-testid=rfe").type("World");
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("@Hello World");
});

test("should automatically insert a space before a mention", async ({
  mount,
}) => {
  const component = await mount(
    <TestComponent autoFocus openSections initialValue="Hello" />
  );
  await component.locator('[data-testid="rfe-mention-to-add"]').type("Harry");
  await component.locator('[data-testid="rfe-add-mention"]').click();
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("Hello @Harry");
});

test("should be able to reset the editor value", async ({ mount }) => {
  const component = await mount(
    <TestComponent autoFocus={false} openSections />
  );
  await component
    .locator('[data-testid="rfe-reset-value"]')
    .type("Hello @World");
  await component.locator("data-testid=rfe-reset").click();
  await expect(component.locator("data-testid=rfe")).toContainText(
    "Hello @World"
  );
  await expect(
    component.locator('[data-testid="mention-World"]')
  ).toContainText("@World");
  await expect(
    component.locator('[data-testid="rfe-editor-value"]')
  ).toContainText("Hello @World");
});

test("should only show suggestions from the current trigger", async ({
  mount,
  page,
}) => {
  const component = await mount(
    <TestComponent autoFocus initialValue="#Hello @World" />
  );
  await component.locator("data-testid=rfe").type("@");
  await expect(
    page.locator('[data-testid="rfe-mention-combobox"]')
  ).toBeVisible();
  await expect(
    page.locator('[data-testid*="rfe-mention-combobox-item-"]')
  ).toHaveCount(3);
  await expect(
    page.locator('[data-testid="rfe-mention-combobox-item-Hello"]')
  ).not.toBeVisible();
});
