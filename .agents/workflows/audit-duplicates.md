# Audit Existing Codebase for Duplicates & Code Smells

1. Run `npx jscpd lib/ --min-lines 8 --min-tokens 50 --reporters console -f dart --ignore "**/*.g.dart,**/*.freezed.dart"` in the terminal to find exact copy-pasted Dart blocks.
2. Scan `lib/` for:
   - Files exceeding 400 lines of code.
   - Screen classes containing `Widget _build` helper methods.
   - Repeated `BoxDecoration`, `TextStyle`, `TextFormField`, and `ElevatedButton` configurations.
   - Repeated `try / catch` blocks across controllers or services.
3. Do NOT modify files yet. Output a prioritized markdown audit table showing:
   - Exact file paths and line numbers of duplicated UI that should become shared widgets in `lib/core/widgets/`.
   - Duplicated business/API logic that should move to a base mixin or repository in `lib/core/`.