import { expect, test } from "@playwright/experimental-ct-react";
import TestComponent from "./Mentions.stage";

test.use({ viewport: { width: 500, height: 500 } });

test("should render a mention", async ({ mount }) => {
  const component = await mount(
    <TestComponent openSections initialValue="Hello @John" />
  );
  const element = component.getByTestId("mention-John");
  await expect(element).toContainText("John");
});

test("should open the mention combobox by typing a trigger key", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  const editor = component.getByTestId("rfe");
  await expect(page.getByTestId("rfe-mention-combobox")).not.toBeVisible();
  await editor.type("@");
  await expect(page.getByTestId("rfe-mention-combobox")).toBeVisible();
  await expect(
    page.getByTestId("rfe-mention-combobox-item-Jane")
  ).toContainText("Jane");
  await expect(
    page.getByTestId("rfe-mention-combobox-item-John")
  ).toContainText("John");
});

test("should open the mention combobox programmatically", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  await expect(page.getByTestId("rfe-mention-combobox")).not.toBeVisible();
  await component.getByTestId("rfe-open-mentions").click();
  await expect(page.getByTestId("rfe-mention-combobox")).toBeVisible();
  await expect(component.getByTestId("rfe-editor-value")).toContainText("@");
});

test("should select a mention by pressing the enter key", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  const editor = component.getByTestId("rfe");
  await editor.type("@");
  await page.keyboard.press("ArrowDown", { delay: 10 });
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("rfe-editor-value")).toContainText("@Jane");
});

test("should limit the suggestions when a search term is entered", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  const editor = component.getByTestId("rfe");
  await editor.type("@Joh");
  await expect(
    page.getByTestId("rfe-mention-combobox-item-Jane")
  ).not.toBeVisible();
  await expect(
    page.getByTestId("rfe-mention-combobox-item-John")
  ).toContainText("John");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("rfe-editor-value")).toContainText("@John");
});

test("should select a mention by clicking on a combobox item", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  await component.getByTestId("rfe-open-mentions").click();
  await page.getByTestId("rfe-mention-combobox-item-Jane").click();
  await expect(component.getByTestId("rfe-editor-value")).toContainText(
    "@Jane"
  );
});

test("should add a mention programmatically", async ({ mount }) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  await component.getByTestId("rfe-mention-to-add").type("Test");
  await component.getByTestId("rfe-add-mention").click();
  await expect(component.getByTestId("rfe-editor-value")).toContainText(
    "@Test"
  );
});

test("should remove a mention programmatically", async ({ mount }) => {
  const component = await mount(
    <TestComponent
      autoFocus
      openSections
      initialValue="This is a @Small @Test"
    />
  );
  await expect(component.getByTestId("rfe-editor-value")).toContainText(
    "This is a @Small @Test"
  );
  await component.getByTestId("rfe-mention-to-remove").type("Test");
  await component.getByTestId("rfe-remove-mention").click();
  await expect(component.getByTestId("rfe-editor-value")).toContainText(
    "This is a @Small"
  );
});

test("should remove all mentions programmatically", async ({ mount, page }) => {
  const component = await mount(
    <TestComponent autoFocus openSections initialValue="@A @B #C" />
  );
  await expect(component.getByTestId("rfe-editor-value")).toContainText(
    "@A @B #C"
  );
  await page.selectOption('[data-testid="rfe-trigger-select"]', "@");
  await component.getByTestId("rfe-remove-mention").click();
  await expect(component.getByTestId("rfe-editor-value")).toContainText("#C");
});

test("should rename a mention", async ({ mount, page }) => {
  const component = await mount(
    <TestComponent autoFocus openSections initialValue="@Hello #World" />
  );
  await expect(component.getByTestId("rfe-editor-value")).toContainText(
    "@Hello #World"
  );
  await page.selectOption('[data-testid="rfe-trigger-select"]', "#");
  await component.getByTestId("rfe-mention-to-rename-filter").type("World");
  await component.getByTestId("rfe-mention-to-rename-value").type("Test");
  await component.getByTestId("rfe-rename-mentions").click();
  await expect(component.getByTestId("rfe-editor-value")).toContainText(
    "@Hello #Test"
  );
});

test("should add a mention when focus is lost from the editor", async ({
  mount,
}) => {
  const component = await mount(<TestComponent autoFocus openSections />);
  await component.getByTestId("rfe").type("@www");
  await component.getByTestId("rfe").evaluate((e) => e.blur());
  await expect(component.getByTestId("mention-www")).toContainText("@www");
});

test("should automatically insert a space after a mention", async ({
  mount,
}) => {
  const component = await mount(
    <TestComponent autoFocus openSections initialValue="@Hello" />
  );
  await component.getByTestId("rfe").type("World");
  await expect(component.getByTestId("rfe-editor-value")).toContainText(
    "@Hello World"
  );
});

test("should automatically insert a space before a mention", async ({
  mount,
}) => {
  const component = await mount(
    <TestComponent autoFocus openSections initialValue="Hello" />
  );
  await component.getByTestId("rfe-mention-to-add").type("Harry");
  await component.getByTestId("rfe-add-mention").click();
  await expect(component.getByTestId("rfe-editor-value")).toContainText(
    "Hello @Harry"
  );
});

test("should be able to reset the editor value", async ({ mount }) => {
  const component = await mount(
    <TestComponent autoFocus={false} openSections />
  );
  await component.getByTestId("rfe-reset-value").type("Hello @World");
  await component.getByTestId("rfe-reset").click();
  await expect(component.getByTestId("rfe")).toContainText("Hello @World");
  await expect(component.getByTestId("mention-World")).toContainText("@World");
  await expect(component.getByTestId("rfe-editor-value")).toContainText(
    "Hello @World"
  );
});

test("should only show suggestions from the current trigger", async ({
  mount,
  page,
}) => {
  const component = await mount(
    <TestComponent autoFocus initialValue="#Hello @World" />
  );
  await component.getByTestId("rfe").type("@");
  await expect(page.getByTestId("rfe-mention-combobox")).toBeVisible();
  await expect(
    page.locator('[data-testid*="rfe-mention-combobox-item-"]')
  ).toHaveCount(3);
  await expect(
    page.getByTestId("rfe-mention-combobox-item-Hello")
  ).not.toBeVisible();
});
