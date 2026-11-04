# Enterprise Flutter Refactoring & Architecture Rules

When auditing, refactoring, or writing code in this project, strictly follow these rules:

1. **Zero UI Helper Methods:** Never write `Widget _build...()` methods inside Screens or Widgets. Always extract reusable `StatelessWidget` classes with `const` constructors.
2. **Design System First (`lib/core/widgets/`):**
   - Never duplicate inline `BoxDecoration`, `TextStyle`, or raw `ElevatedButton` / `TextFormField` styling across multiple screens.
   - Check `lib/core/widgets/` first. If a UI pattern is used 3 or more times, extract or reuse `AppButton`, `AppTextField`, `AppCard`, or `AppStateView`.
3. **Zero Repeated Try/Catch Logic:**
   - Do not repeat `try / catch / finally` and `isLoading` toggles inside Controller, Notifier, or BLoC methods.
   - Route all async operations through the shared `SafeExecutionMixin` or centralized error handler in `lib/core/base/`.
4. **Incremental Feature Structure:**
   - Any refactored feature must follow `lib/features/<feature_name>/{data, logic, presentation/screens, presentation/widgets}`.
   - Always use full package imports (`package:your_app/...`), never relative imports across features.
5. **Verification:** After every refactor, check the Dart MCP server diagnostics (`flutter analyze`) and ensure zero new warnings or broken imports.