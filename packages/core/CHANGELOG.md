# Changelog

## [3.1.0](https://github.com/sodenn/react-fluent-edit/compare/core-v3.0.2...core-v3.1.0) (2023-02-21)


### Features

* **Mentions:** add option to prevent the user from adding new mentions ([#127](https://github.com/sodenn/react-fluent-edit/issues/127)) ([3dec568](https://github.com/sodenn/react-fluent-edit/commit/3dec568f1a9559d74a55cde969e82b047fb0bad3))

## [3.0.2](https://github.com/sodenn/react-fluent-edit/compare/core-v3.0.1...core-v3.0.2) (2023-02-13)


### Bug Fixes

* incorrect combobox position when using WKWebView ([#119](https://github.com/sodenn/react-fluent-edit/issues/119)) ([6f50317](https://github.com/sodenn/react-fluent-edit/commit/6f50317e6244f1e4da8425c823486bac13763819))

## [3.0.1](https://github.com/sodenn/react-fluent-edit/compare/core-v3.0.0...core-v3.0.1) (2023-02-05)


### Miscellaneous Chores

* **core:** Synchronize undefined versions

## [3.0.0](https://github.com/sodenn/react-fluent-edit/compare/core-v2.2.1...core-v3.0.0) (2023-01-04)


### ⚠ BREAKING CHANGES

* The `MuiMentionCombobox` component was removed. Use the `MentionCombobox` instead; The `FluentEdit.value` prop was removed. Use `initialValue` instead; The `FluentEdit.singleLine` prop was removed. Use `multiline` instead; The `MentionCombobox.ListComponent`, `MentionCombobox.ListItemComponent` and `MentionCombobox.zIndex` props are removed. Use the new `FluentEdit.comboboxComponent`, `FluentEdit.comboboxItemComponent` and `FluentEdit.comboboxRootStyle` props instead.

### Features

* configure combobox component via core plugin ([c84c082](https://github.com/sodenn/react-fluent-edit/commit/c84c082ed7569edc7f2ac5456fc277a958cfe3f6))

## [2.2.1](https://github.com/sodenn/react-fluent-edit/compare/core-v2.2.0...core-v2.2.1) (2022-10-15)


### Miscellaneous Chores

* **core:** Synchronize undefined versions

## [2.2.0](https://github.com/sodenn/react-fluent-edit/compare/core-v2.1.0...core-v2.2.0) (2022-10-09)


### Features

* allows dragging HTML elements into the editor ([#67](https://github.com/sodenn/react-fluent-edit/issues/67)) ([c83efe2](https://github.com/sodenn/react-fluent-edit/commit/c83efe290399f85d7dea658ff66ebfb330e74a12))

## [2.1.0](https://github.com/sodenn/react-fluent-edit/compare/core-v2.0.0...core-v2.1.0) (2022-09-26)


### Features

* allow to reset the value of the editor ([#63](https://github.com/sodenn/react-fluent-edit/issues/63)) ([6a9d892](https://github.com/sodenn/react-fluent-edit/commit/6a9d892bc7229b1afd595a78bc3c712e17527db5))


### Bug Fixes

* remove broken source maps ([#59](https://github.com/sodenn/react-fluent-edit/issues/59)) ([269bcc3](https://github.com/sodenn/react-fluent-edit/commit/269bcc3fa53551116d4a6fd4fbfb3950b4ea3089))

## [2.0.0](https://github.com/sodenn/react-fluent-edit/compare/core-v1.0.3...core-v2.0.0) (2022-09-22)


### ⚠ BREAKING CHANGES

* **plugin:** the `Plugin.leaves` key was renamed to `Plugin.leave`; the `Plugin.elements` key was renamed to `Plugin.element`

### Features

* **plugin:** markdown preview support ([#43](https://github.com/sodenn/react-fluent-edit/issues/43)) ([6c324fa](https://github.com/sodenn/react-fluent-edit/commit/6c324fabb43f14954f6fe83756fc411215e94a38))

## [1.0.3](https://github.com/sodenn/react-fluent-edit/compare/core-v1.0.2...core-v1.0.3) (2022-08-16)


### Miscellaneous Chores

* **core:** Synchronize undefined versions

## [1.0.2](https://github.com/sodenn/react-fluent-edit/compare/core-v1.0.1...core-v1.0.2) (2022-08-14)


### Miscellaneous Chores

* **core:** Synchronize undefined versions

## [1.0.1](https://github.com/sodenn/react-fluent-edit/compare/core-v1.0.0...core-v1.0.1) (2022-08-13)


### Bug Fixes

* **release:** trigger manual release ([c2fb4e4](https://github.com/sodenn/react-fluent-edit/commit/c2fb4e4493a239ec8a59f037bd377c820f5dd52c))

## 1.0.0 (2022-08-12)


### Bug Fixes

* **FluentEdit:** propagate keyDown event ([7553969](https://github.com/sodenn/react-fluent-edit/commit/755396948feacc254fe7f248be355ad615de5006))
