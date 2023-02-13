# Changelog

## [3.0.2](https://github.com/sodenn/react-fluent-edit/compare/markdown-v3.0.1...markdown-v3.0.2) (2023-02-13)


### Miscellaneous Chores

* **markdown:** Synchronize undefined versions

## [3.0.1](https://github.com/sodenn/react-fluent-edit/compare/markdown-v3.0.0...markdown-v3.0.1) (2023-02-05)


### Bug Fixes

* **deps:** update dependency marked to v4.2.12 ([#114](https://github.com/sodenn/react-fluent-edit/issues/114)) ([73d821a](https://github.com/sodenn/react-fluent-edit/commit/73d821afb0980e610497ea56be5dbfca19680f86))

## [3.0.0](https://github.com/sodenn/react-fluent-edit/compare/markdown-v2.2.1...markdown-v3.0.0) (2023-01-04)


### ⚠ BREAKING CHANGES

* The `MuiMentionCombobox` component was removed. Use the `MentionCombobox` instead; The `FluentEdit.value` prop was removed. Use `initialValue` instead; The `FluentEdit.singleLine` prop was removed. Use `multiline` instead; The `MentionCombobox.ListComponent`, `MentionCombobox.ListItemComponent` and `MentionCombobox.zIndex` props are removed. Use the new `FluentEdit.comboboxComponent`, `FluentEdit.comboboxItemComponent` and `FluentEdit.comboboxRootStyle` props instead.
* **plugin:** the `Plugin.leaves` key was renamed to `Plugin.leave`; the `Plugin.elements` key was renamed to `Plugin.element`

### Features

* allows dragging HTML elements into the editor ([#67](https://github.com/sodenn/react-fluent-edit/issues/67)) ([c83efe2](https://github.com/sodenn/react-fluent-edit/commit/c83efe290399f85d7dea658ff66ebfb330e74a12))
* configure combobox component via core plugin ([c84c082](https://github.com/sodenn/react-fluent-edit/commit/c84c082ed7569edc7f2ac5456fc277a958cfe3f6))
* **plugin:** markdown preview support ([#43](https://github.com/sodenn/react-fluent-edit/issues/43)) ([6c324fa](https://github.com/sodenn/react-fluent-edit/commit/6c324fabb43f14954f6fe83756fc411215e94a38))


### Bug Fixes

* **deps:** update dependency marked to v4.1.1 ([#66](https://github.com/sodenn/react-fluent-edit/issues/66)) ([281d7bf](https://github.com/sodenn/react-fluent-edit/commit/281d7bf41d495ddb852c30b2466e5d2865cd3619))
* **deps:** update dependency marked to v4.2.3 ([#82](https://github.com/sodenn/react-fluent-edit/issues/82)) ([af379f9](https://github.com/sodenn/react-fluent-edit/commit/af379f9efed985b201cbdccf028da52d60a549c1))
* **deps:** update dependency marked to v4.2.4 ([#89](https://github.com/sodenn/react-fluent-edit/issues/89)) ([4da50c5](https://github.com/sodenn/react-fluent-edit/commit/4da50c5cf13f6d561a96fd3ba1bf867735ad75f6))
* **deps:** update dependency marked to v4.2.5 ([#102](https://github.com/sodenn/react-fluent-edit/issues/102)) ([d563d01](https://github.com/sodenn/react-fluent-edit/commit/d563d01fdcc8f5f785fc19ba17583738c0d20611))
* remove broken source maps ([#59](https://github.com/sodenn/react-fluent-edit/issues/59)) ([269bcc3](https://github.com/sodenn/react-fluent-edit/commit/269bcc3fa53551116d4a6fd4fbfb3950b4ea3089))
