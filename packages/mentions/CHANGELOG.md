# Changelog

## [3.2.0](https://github.com/sodenn/react-fluent-edit/compare/mentions-v3.1.0...mentions-v3.2.0) (2023-03-05)


### Features

* **Mentions:** only allow mentions that are predefined if `disableCreatable=true` ([#131](https://github.com/sodenn/react-fluent-edit/issues/131)) ([443668a](https://github.com/sodenn/react-fluent-edit/commit/443668a5a9fe2422f6de16636c2a5d55cb6ed911))

## [3.1.0](https://github.com/sodenn/react-fluent-edit/compare/mentions-v3.0.2...mentions-v3.1.0) (2023-02-21)


### Features

* **Mentions:** add option to prevent the user from adding new mentions ([#127](https://github.com/sodenn/react-fluent-edit/issues/127)) ([3dec568](https://github.com/sodenn/react-fluent-edit/commit/3dec568f1a9559d74a55cde969e82b047fb0bad3))

## [3.0.2](https://github.com/sodenn/react-fluent-edit/compare/mentions-v3.0.1...mentions-v3.0.2) (2023-02-13)


### Miscellaneous Chores

* **mentions:** Synchronize undefined versions

## [3.0.1](https://github.com/sodenn/react-fluent-edit/compare/mentions-v3.0.0...mentions-v3.0.1) (2023-02-05)


### Miscellaneous Chores

* **mentions:** Synchronize undefined versions

## [3.0.0](https://github.com/sodenn/react-fluent-edit/compare/mentions-v2.2.1...mentions-v3.0.0) (2023-01-04)


### ⚠ BREAKING CHANGES

* The `MuiMentionCombobox` component was removed. Use the `MentionCombobox` instead; The `FluentEdit.value` prop was removed. Use `initialValue` instead; The `FluentEdit.singleLine` prop was removed. Use `multiline` instead; The `MentionCombobox.ListComponent`, `MentionCombobox.ListItemComponent` and `MentionCombobox.zIndex` props are removed. Use the new `FluentEdit.comboboxComponent`, `FluentEdit.comboboxItemComponent` and `FluentEdit.comboboxRootStyle` props instead.

### Features

* configure combobox component via core plugin ([c84c082](https://github.com/sodenn/react-fluent-edit/commit/c84c082ed7569edc7f2ac5456fc277a958cfe3f6))

## [2.2.1](https://github.com/sodenn/react-fluent-edit/compare/mentions-v2.2.0...mentions-v2.2.1) (2022-10-15)


### Bug Fixes

* **mentions:** only show suggestions from the current trigger ([#78](https://github.com/sodenn/react-fluent-edit/issues/78)) ([ff987a0](https://github.com/sodenn/react-fluent-edit/commit/ff987a0f7ae74648b60496622c2fb23dc53ea48d))

## [2.2.0](https://github.com/sodenn/react-fluent-edit/compare/mentions-v2.1.0...mentions-v2.2.0) (2022-10-09)


### Features

* allows dragging HTML elements into the editor ([#67](https://github.com/sodenn/react-fluent-edit/issues/67)) ([c83efe2](https://github.com/sodenn/react-fluent-edit/commit/c83efe290399f85d7dea658ff66ebfb330e74a12))


### Performance Improvements

* optimize removal of specific nodes ([#71](https://github.com/sodenn/react-fluent-edit/issues/71)) ([7d214cb](https://github.com/sodenn/react-fluent-edit/commit/7d214cbced35d1fb597bf4131b0e36a21dcc09a1))

## [2.1.0](https://github.com/sodenn/react-fluent-edit/compare/mentions-v2.0.0...mentions-v2.1.0) (2022-09-26)


### Features

* allow to reset the value of the editor ([#63](https://github.com/sodenn/react-fluent-edit/issues/63)) ([6a9d892](https://github.com/sodenn/react-fluent-edit/commit/6a9d892bc7229b1afd595a78bc3c712e17527db5))

## [2.0.0](https://github.com/sodenn/react-fluent-edit/compare/mentions-v1.0.3...mentions-v2.0.0) (2022-09-22)


### ⚠ BREAKING CHANGES

* **plugin:** the `Plugin.leaves` key was renamed to `Plugin.leave`; the `Plugin.elements` key was renamed to `Plugin.element`

### Features

* **plugin:** markdown preview support ([#43](https://github.com/sodenn/react-fluent-edit/issues/43)) ([6c324fa](https://github.com/sodenn/react-fluent-edit/commit/6c324fabb43f14954f6fe83756fc411215e94a38))


### Bug Fixes

* insert a space before a mention ([#58](https://github.com/sodenn/react-fluent-edit/issues/58)) ([7254dc4](https://github.com/sodenn/react-fluent-edit/commit/7254dc4ab840e72186ee97d2c25950fafcf7fc0d))

## [1.0.3](https://github.com/sodenn/react-fluent-edit/compare/mentions-v1.0.2...mentions-v1.0.3) (2022-08-16)


### Bug Fixes

* **MentionCombobox:** avoid unnecessary re-rendering by using the useSlateStatic hook ([#33](https://github.com/sodenn/react-fluent-edit/issues/33)) ([44ac169](https://github.com/sodenn/react-fluent-edit/commit/44ac16968d4a25beaeb4ec82e1bf7601957a0149))

## [1.0.2](https://github.com/sodenn/react-fluent-edit/compare/mentions-v1.0.1...mentions-v1.0.2) (2022-08-14)


### Bug Fixes

* **MentionsCombobox:** prevents event propagation when mention combobox is open ([#29](https://github.com/sodenn/react-fluent-edit/issues/29)) ([54a3619](https://github.com/sodenn/react-fluent-edit/commit/54a36192cd77cc1a5b472854514bdca1f0e1ad40))

## [1.0.1](https://github.com/sodenn/react-fluent-edit/compare/mentions-v1.0.0...mentions-v1.0.1) (2022-08-13)


### Miscellaneous Chores

* **mentions:** Synchronize undefined versions

## 1.0.0 (2022-08-12)


### Miscellaneous Chores

* **mentions:** Synchronize undefined versions
