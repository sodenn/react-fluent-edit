import { expect, test } from "@playwright/experimental-ct-react";
import { TestComponent } from "./MentionsPlayground.tc";

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
  await expect(
    page.locator('[data-testid="fe-mention-combobox-item-Jane"]')
  ).toContainText("Jane");
  await expect(
    page.locator('[data-testid="fe-mention-combobox-item-John"]')
  ).toContainText("John");
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
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("@");
});

test("should select a mention when pressing the enter key", async ({
  mount,
  page,
}) => {
  const component = await mount(<TestComponent autoFocus />);
  const editor = component.locator("data-testid=fe");
  await editor.type("@");
  await page.keyboard.press("ArrowDown", { delay: 10 });
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
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("@Jane");
});

test("should add a mention from outside of the editor", async ({ mount }) => {
  const component = await mount(<TestComponent autoFocus />);
  await component.locator('[data-testid="fe-mention-to-add"]').type("Test");
  await component.locator('[data-testid="fe-add-mention"]').click();
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("@Test");
});

test("should remove a mention from outside of the editor", async ({
  mount,
}) => {
  const component = await mount(
    <TestComponent autoFocus initialValue="This is a @Small @Test" />
  );
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("This is a @Small @Test");
  await component.locator('[data-testid="fe-mention-to-remove"]').type("Test");
  await component.locator('[data-testid="fe-remove-mention"]').click();
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("This is a @Small");
});

test("should remove all mention from outside of the editor", async ({
  mount,
  page,
}) => {
  const component = await mount(
    <TestComponent autoFocus initialValue="@A @B #C" />
  );
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("@A @B #C");
  await page.selectOption('[data-testid="fe-trigger-select"]', "@");
  await component.locator('[data-testid="fe-remove-mention"]').click();
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("#C");
});

test("should rename a mention", async ({ mount, page }) => {
  const component = await mount(
    <TestComponent autoFocus initialValue="@Hello #World" />
  );
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("@Hello #World");
  await page.selectOption('[data-testid="fe-trigger-select"]', "#");
  await component
    .locator('[data-testid="fe-mention-to-rename-filter"]')
    .type("World");
  await component
    .locator('[data-testid="fe-mention-to-rename-value"]')
    .type("Test");
  await component.locator('[data-testid="fe-rename-mentions"]').click();
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("@Hello #Test");
});

test("should add a mention when focus is lost", async ({ mount }) => {
  const component = await mount(<TestComponent autoFocus />);
  await component.locator("data-testid=fe").type("@www");
  await component.locator("data-testid=fe").evaluate((e) => e.blur());
  await expect(component.locator('[data-testid="mention-www"]')).toContainText(
    "@www"
  );
});

test("should automatically insert a space after a mention", async ({
  mount,
}) => {
  const component = await mount(
    <TestComponent autoFocus initialValue="@Hello" />
  );
  await component.locator("data-testid=fe").type("World");
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("@Hello World");
});

test("should automatically insert a space before a mention", async ({
  mount,
}) => {
  const component = await mount(
    <TestComponent autoFocus initialValue="Hello" />
  );
  await component.locator('[data-testid="fe-mention-to-add"]').type("Harry");
  await component.locator('[data-testid="fe-add-mention"]').click();
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("Hello @Harry");
});

test("should be able to reset the editor value", async ({ mount }) => {
  const component = await mount(<TestComponent autoFocus={false} />);
  await component
    .locator('[data-testid="fe-reset-value"]')
    .type("Hello @World");
  await component.locator("data-testid=fe-reset").click();
  await expect(component.locator("data-testid=fe")).toContainText(
    "Hello @World"
  );
  await expect(
    component.locator('[data-testid="mention-World"]')
  ).toContainText("@World");
  await expect(
    component.locator('[data-testid="fe-editor-value"]')
  ).toContainText("Hello @World");
});
