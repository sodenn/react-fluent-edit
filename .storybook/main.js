module.exports = {
  stories: [
    "../packages/**/src/**/*.stories.mdx",
    "../packages/**/src/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: {
    builder: "@storybook/builder-vite",
  },
  docs: {
    docsPage: "automatic",
  },
};
