# Changelog

## [3.1.0](https://github.com/sodenn/react-fluent-edit/compare/dnd-v3.0.2...dnd-v3.1.0) (2023-02-21)


### Miscellaneous Chores

* **dnd:** Synchronize undefined versions

## [3.0.2](https://github.com/sodenn/react-fluent-edit/compare/dnd-v3.0.1...dnd-v3.0.2) (2023-02-13)


### Miscellaneous Chores

* **dnd:** Synchronize undefined versions

## [3.0.1](https://github.com/sodenn/react-fluent-edit/compare/dnd-v3.0.0...dnd-v3.0.1) (2023-02-05)


### Miscellaneous Chores

* **dnd:** Synchronize undefined versions

## [3.0.0](https://github.com/sodenn/react-fluent-edit/compare/dnd-v2.2.1...dnd-v3.0.0) (2023-01-04)


### ⚠ BREAKING CHANGES

* The `MuiMentionCombobox` component was removed. Use the `MentionCombobox` instead; The `FluentEdit.value` prop was removed. Use `initialValue` instead; The `FluentEdit.singleLine` prop was removed. Use `multiline` instead; The `MentionCombobox.ListComponent`, `MentionCombobox.ListItemComponent` and `MentionCombobox.zIndex` props are removed. Use the new `FluentEdit.comboboxComponent`, `FluentEdit.comboboxItemComponent` and `FluentEdit.comboboxRootStyle` props instead.

### Features

* configure combobox component via core plugin ([c84c082](https://github.com/sodenn/react-fluent-edit/commit/c84c082ed7569edc7f2ac5456fc277a958cfe3f6))

## [2.2.1](https://github.com/sodenn/react-fluent-edit/compare/dnd-v2.2.0...dnd-v2.2.1) (2022-10-15)


### Miscellaneous Chores

* **dnd:** Synchronize undefined versions

## [2.2.0](https://github.com/sodenn/react-fluent-edit/compare/dnd-v2.1.0...dnd-v2.2.0) (2022-10-09)


### Features

* allows dragging HTML elements into the editor ([#67](https://github.com/sodenn/react-fluent-edit/issues/67)) ([c83efe2](https://github.com/sodenn/react-fluent-edit/commit/c83efe290399f85d7dea658ff66ebfb330e74a12))
* insert a space after a DnD element is dropped ([#72](https://github.com/sodenn/react-fluent-edit/issues/72)) ([fe27665](https://github.com/sodenn/react-fluent-edit/commit/fe27665c313e9df70d5963edf7d95ad3802aba1c))


### Bug Fixes

* **DnD:** remove trailing spaces after moving a DnD item ([#74](https://github.com/sodenn/react-fluent-edit/issues/74)) ([d2b28cd](https://github.com/sodenn/react-fluent-edit/commit/d2b28cd3959d1cd141411c3fe68fd57f9045eda2))


### Performance Improvements

* optimize removal of specific nodes ([#71](https://github.com/sodenn/react-fluent-edit/issues/71)) ([7d214cb](https://github.com/sodenn/react-fluent-edit/commit/7d214cbced35d1fb597bf4131b0e36a21dcc09a1))
