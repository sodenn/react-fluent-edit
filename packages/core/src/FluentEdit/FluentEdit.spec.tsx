import { expect, test } from "@playwright/experimental-ct-react";
import TestComponent from "./FluentEdit.stage";

test.use({ viewport: { width: 500, height: 500 } });

test("should render a placeholder", async ({ mount }) => {
  const component = await mount(<TestComponent placeholder="Hello World 😀" />);
  const editor = component.getByTestId("rfe");
  await expect(editor).toContainText("Hello World 😀");
});

test("should not render a placeholder", async ({ mount }) => {
  const component = await mount(
    <TestComponent placeholder="Hello World 😀" initialValue="Lorem Ipsum" />
  );
  const editor = component.getByTestId("rfe");
  await expect(editor).not.toContainText("Hello World 😀");
});

test("should call the change handler with the initial value", async ({
  mount,
}) => {
  const component = await mount(<TestComponent initialValue="Lorem Ipsum" />);
  const editorValue = component.getByTestId("rfe-value");
  await expect(editorValue).toContainText("Lorem Ipsum");
});

test("should initially set the focus in the text field", async ({ mount }) => {
  const component = await mount(<TestComponent autoFocus={true} />);
  const editor = component.getByTestId("rfe");
  await expect(editor).toBeFocused();
});

test("should not add a new line when pressing enter if singleLine=true", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent singleLine={true} />);
  await page.keyboard.press("Enter");
  await expect(component.locator('p[data-slate-node="element"]')).toHaveCount(
    1
  );
});

test("should add a new line when pressing enter", async ({ mount, page }) => {
  const component = await mount(<TestComponent />);
  await page.keyboard.press("Enter");
  await expect(component.locator('p[data-slate-node="element"]')).toHaveCount(
    2
  );
});

test("should be able to focus the editor via hook function", async ({
  mount,
}) => {
  const component = await mount(<TestComponent autoFocus={false} />);
  const editor = component.getByTestId("rfe");
  await expect(editor).not.toBeFocused();
  await component.getByTestId("rfe-focus").click();
  await expect(editor).toBeFocused();
});

test("should be able to reset the current editor value", async ({ mount }) => {
  const component = await mount(
    <TestComponent autoFocus={false} initialValue="Test" />
  );
  const editor = component.getByTestId("rfe");
  await expect(editor).toContainText("Test");
  await component.getByTestId("rfe-reset").click();
  await expect(editor).toContainText("");
});
