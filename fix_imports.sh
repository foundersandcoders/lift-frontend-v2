#!/bin/bash

# Fix import paths for UI components
find src/features -type f -name "*.tsx" -exec sed -i 's/from "\.\.\/ui\//from "\.\.\/\.\.\/\.\.\/components\/ui\//g' {} \;
find src/features -type f -name "*.tsx" -exec sed -i "s/from '\.\.\/ui\//from '\.\.\/\.\.\/\.\.\/components\/ui\//g" {} \;

# Fix import paths for hooks
find src/features -type f -name "*.ts" -exec sed -i 's/from "\.\.\/hooks\/useEntries"/from "\.\.\/\.\.\/statements\/hooks\/useEntries"/g' {} \;
find src/features -type f -name "*.tsx" -exec sed -i 's/from "\.\.\/hooks\/useEntries"/from "\.\.\/\.\.\/statements\/hooks\/useEntries"/g' {} \;
find src/features -type f -name "*.ts" -exec sed -i "s/from '\.\.\/hooks\/useEntries'/from '\.\.\/\.\.\/statements\/hooks\/useEntries'/g" {} \;
find src/features -type f -name "*.tsx" -exec sed -i "s/from '\.\.\/hooks\/useEntries'/from '\.\.\/\.\.\/statements\/hooks\/useEntries'/g" {} \;

# Fix import paths for statements components
find src/features -type f -name "*.tsx" -exec sed -i 's/from "\.\.\/statements\//from "\.\.\/\.\.\/statements\/components\//g' {} \;
find src/features -type f -name "*.tsx" -exec sed -i "s/from '\.\.\/statements\//from '\.\.\/\.\.\/statements\/components\//g" {} \;

# Fix import paths for wizard components
find src/features -type f -name "*.tsx" -exec sed -i 's/from "\.\.\/statementWizard\//from "\.\.\/\.\.\/wizard\/components\//g' {} \;
find src/features -type f -name "*.tsx" -exec sed -i "s/from '\.\.\/statementWizard\//from '\.\.\/\.\.\/wizard\/components\//g" {} \;

# Fix import paths for utility functions
find src/features -type f -name "*.ts" -exec sed -i 's/from "\.\.\/\.\.\/\.\.\/utils\//from "\.\.\/\.\.\/\.\.\/lib\/utils\//g' {} \;
find src/features -type f -name "*.tsx" -exec sed -i 's/from "\.\.\/\.\.\/\.\.\/utils\//from "\.\.\/\.\.\/\.\.\/lib\/utils\//g' {} \;
find src/features -type f -name "*.ts" -exec sed -i "s/from '\.\.\/\.\.\/\.\.\/utils\//from '\.\.\/\.\.\/\.\.\/lib\/utils\//g" {} \;
find src/features -type f -name "*.tsx" -exec sed -i "s/from '\.\.\/\.\.\/\.\.\/utils\//from '\.\.\/\.\.\/\.\.\/lib\/utils\//g" {} \;

# Fix import paths for types
find src/features -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\//from "\.\.\/\.\.\/types\//g' {} \;
find src/features -type f -name "*.tsx" -exec sed -i 's/from "\.\.\/types\//from "\.\.\/\.\.\/types\//g' {} \;
find src/features -type f -name "*.ts" -exec sed -i "s/from '\.\.\/types\//from '\.\.\/\.\.\/types\//g" {} \;
find src/features -type f -name "*.tsx" -exec sed -i "s/from '\.\.\/types\//from '\.\.\/\.\.\/types\//g" {} \;

# Fix debugger import
sed -i "s/from '\.\.\/\.\.\/hooks\/useEntries'/from '\.\.\/\.\.\/features\/statements\/hooks\/useEntries'/g" src/components/debug/TestButton.tsx

# Fix specificially for question hooks
find src/features -type f -name "*.ts" -exec sed -i 's/from "\.\/useEntries"/from "\.\.\/\.\.\/statements\/hooks\/useEntries"/g' {} \;
find src/features -type f -name "*.ts" -exec sed -i "s/from '\.\/useEntries'/from '\.\.\/\.\.\/statements\/hooks\/useEntries'/g" {} \;

# Fix context imports for questions
find src/features -type f -name "*.ts" -exec sed -i 's/from "\.\.\/context\/QuestionsContext"/from "\.\.\/\.\.\/providers\/QuestionsContext"/g' {} \;
find src/features -type f -name "*.ts" -exec sed -i "s/from '\.\.\/context\/QuestionsContext'/from '\.\.\/\.\.\/providers\/QuestionsContext'/g" {} \;

echo "Import paths updated. Some manual fixes may still be required."