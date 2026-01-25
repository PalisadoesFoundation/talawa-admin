/**
 * Search input restrictions - disabled for search component custom implementations and reuse existing components.
 * For more details refer `docs/docs/docs/developer-resources/reusable-components.md`
 */
export const searchInputRestrictions = [
  {
    selector:
      "JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='type'] > Literal[value='search']",
    message:
      'Direct <input type="search"> is not allowed. Use SearchBar or SearchFilterBar components instead.',
  },
  {
    selector:
      "JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='placeholder'] > Literal[value=/[Ss]earch|[Ff]ind|[Qq]uer/]",
    message:
      'Input with search-related placeholder detected. Use SearchBar or SearchFilterBar components for search functionality.',
  },
  {
    selector:
      "JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='name'] > Literal[value=/[Ss]earch/]",
    message:
      'Input with search-related name detected. Use SearchBar or SearchFilterBar components for search functionality.',
  },
  {
    selector:
      "JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='id'] > Literal[value=/[Ss]earch/]",
    message:
      'Input with search-related id detected. Use SearchBar or SearchFilterBar components for search functionality.',
  },
  {
    selector:
      "JSXOpeningElement[name.name='input'] > JSXAttribute[name.name='aria-label'] > Literal[value=/[Ss]earch|[Ff]ind|[Qq]uer/]",
    message:
      'Input with search-related aria-label detected. Use SearchBar or SearchFilterBar components for search functionality.',
  },
];
