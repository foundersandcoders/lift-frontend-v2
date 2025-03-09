import type { Category } from '../types/entries';
import categoryStructure from '../data/categoryStructure.json';

/**
 * Gets the root category from the category structure.
 * This is a private helper function used within this module only.
 */
function getCategoryRoot(): Category {
  return categoryStructure.root as Category;
}

/**
 * Recursively searches for a category node with the given name.
 */
export function findCategoryByName(
  root: Category,
  name: string
): Category | null {
  if (root.name === name) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findCategoryByName(child, name);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Returns all descendant category names for the given node, including the node's own name.
 */
export function getAllDescendants(node: Category): string[] {
  const names: string[] = [node.name];
  if (node.children) {
    for (const child of node.children) {
      names.push(...getAllDescendants(child));
    }
  }
  return names;
}

/**
 * For a given verb, returns the color of the first matching category found in the tree.
 */
export function getVerbColor(
  verb: { categories: string[] },
  root: Category = getCategoryRoot()
): string {
  for (const catName of verb.categories) {
    const cat = findCategoryByName(root, catName);
    if (cat) return cat.color;
  }
  return 'transparent';
}
