# react-fluent-edit

[![CI status][github-ci-action-image]][github-ci-action-url]
[![CodeQL status][github-codeql-analysis-action-image]][github-codeql-analysis-action-url]

[github-ci-action-image]: https://github.com/sodenn/react-fluent-edit/actions/workflows/ci.yml/badge.svg
[github-ci-action-url]: https://github.com/sodenn/react-fluent-edit/actions/workflows/ci.yml
[github-codeql-analysis-action-image]: https://github.com/sodenn/react-fluent-edit/actions/workflows/codeql-analysis.yml/badge.svg
[github-codeql-analysis-action-url]: https://github.com/sodenn/react-fluent-edit/actions/workflows/codeql-analysis.yml

Brings easy-to-use mentions, markdown and DnD (WIP) features to [Slate](https://github.com/ianstormtaylor/slate).

## Installation

Install the core package in your project directory:

```bash
// with npm
npm install @react-fluent-edit/core

// with yarn
yarn add @react-fluent-edit/core
```

Since **react-fluent-edit** is based on **Slate**, the following dependencies also need to be installed:

```bash
// with npm
npm install slate slate-history slate-react

// with yarn
yarn add slate slate-history slate-react
```

Install additional packages of your choice:

```bash
// with npm
npm install @react-fluent-edit/mentions

// with yarn
yarn add @react-fluent-edit/mentions
```

## Packages

**react-fluent-edit** consists of the following packages:

- @react-fluent-edit/mentions<br>
  <img width="400" src="resources/mentions1.png" alt="Screenshot" style="border-radius: 4px">
  <img width="400" src="resources/mentions2.png" alt="Screenshot" style="border-radius: 4px">
- @react-fluent-edit/markdown<br>
  <img width="400" src="resources/markdown.gif" alt="Screenshot" style="border-radius: 4px">
- @react-fluent-edit/dnd<br>
  <img width="400" src="resources/dnd.gif" alt="Screenshot" style="border-radius: 4px">
- @react-fluent-edit/mui<br>
  Bindings for using [MUI (Material UI)](https://mui.com/) with react-fluent-edit.
