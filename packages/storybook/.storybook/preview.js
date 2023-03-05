export default {
  parameters: {
    layout: "centered",
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  argTypes: {
    autoCorrect: { control: "select", options: [undefined, "on", "off"] },
    autoCapitalize: { control: "select", options: [undefined, "on", "off"] },
  },
};
