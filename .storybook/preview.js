export const parameters = {
  layout: "centered",
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const argTypes = {
  autoCorrect: { control: "select", options: ["on", "off"] },
  autoCapitalize: { control: "select", options: ["on", "off"] },
  autoFocusPosition: {
    control: "select",
    options: ["start", "end"],
  },
};
