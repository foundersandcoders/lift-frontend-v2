# Project Structure Migration Guide

## Directory Structure Changes

We've restructured the project to follow a more organized, feature-based architecture. Here's a summary of what changed:

### Feature-based Organization

Files are now organized by feature, with each feature containing its own:
- Components
- Hooks
- Context
- API calls
- Types (when feature-specific)

### New Directory Structure

```
src/
├── assets/             # Images and static assets
├── components/         # Shared UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── modals/         # Modal dialogs
│   └── shared/         # Other shared components
├── config/             # Application configuration
├── data/               # Static data files (JSON, etc.)
├── features/           # Feature-specific code
│   ├── auth/           # Authentication feature
│   ├── email/          # Email-related functionality
│   ├── questions/      # Questions management
│   ├── statements/     # Statements management
│   └── wizard/         # Statement wizard feature
├── layouts/            # Layout components
├── lib/                # Shared utilities
│   └── utils/          # Utility functions
├── providers/          # Context providers
├── routes/             # Route definitions
└── types/              # TypeScript type definitions
```

## Import Updates Required

Due to the restructuring, imports in files need to be updated. Here are the general patterns to follow:

### Old vs New Import Paths

| Old Import Path | New Import Path |
|-----------------|-----------------|
| `../components/ui/...` | `../components/ui/...` (unchanged) |
| `../components/Header` | `../layouts/components/Header` |
| `../components/MainPage` | `../layouts/components/MainPage` |
| `../context/AuthContext` | `../features/auth/AuthContext` |
| `../context/AuthProvider` | `../features/auth/AuthProvider` |
| `../context/EntriesContext` | `../features/statements/context/EntriesContext` |
| `../context/EntriesProvider` | `../features/statements/context/EntriesProvider` |
| `../context/QuestionsContext` | `../providers/QuestionsContext` |
| `../context/QuestionsProvider` | `../providers/QuestionsProvider` |
| `../hooks/useAuth` | `../features/auth/hooks/useAuth` |
| `../hooks/useEntries` | `../features/statements/hooks/useEntries` |
| `../hooks/useQuestions` | `../features/questions/hooks/useQuestions` |
| `../api/authApi` | `../features/auth/api/authApi` |
| `../api/entriesApi` | `../features/statements/api/entriesApi` |
| `../api/emailApi` | `../features/email/api/emailApi` |
| `../utils/...` | `../lib/utils/...` |
| `../data/...` | `../data/...` |

## Next Steps

1. Update imports in all files
2. Run tests to ensure the restructuring doesn't break functionality
3. Update build scripts if needed to accommodate the new structure

This restructuring will make the codebase more maintainable, easier to navigate, and better prepared for future growth.