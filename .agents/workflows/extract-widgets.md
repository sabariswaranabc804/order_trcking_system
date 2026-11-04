# Refactor Monolithic Screen & Extract Custom Widgets

For the specified screen file:
1. Identify all `_build*()` methods and deeply nested UI blocks.
2. Check `lib/core/widgets/` for existing shared components (`AppButton`, `AppTextField`, `AppCard`) and replace raw Material widgets with them.
3. If a widget is generic and reusable across the app, extract it as a `const` `StatelessWidget` inside `lib/core/widgets/`.
4. If a widget is specific only to this screen, extract it as a `const` `StatelessWidget` in the feature's `presentation/widgets/` folder.
5. Run Dart MCP diagnostics to verify zero analysis errors and trigger hot reload.