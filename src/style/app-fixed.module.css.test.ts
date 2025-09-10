/**
 * Tests for src/style/app-fixed.module.css
 *
 * Testing library/framework: This suite is written to be compatible with both Jest and Vitest.
 * - If using Vitest, globals (describe/it/expect) are available and vi timers work.
 * - If using Jest, globals (describe/it/expect) are available as well.
 *
 * Strategy:
 * - Parse CSS content as text and assert on:
 *   - Critical class selectors added/modified in this PR (diff-focused assumptions).
 *   - CSS custom properties (tokens) existence and non-empty values.
 *   - Media queries/breakpoints presence and structure.
 *   - Regressions like duplicate selectors or obvious syntax issues (rudimentary).
 *
 * Notes:
 * - We avoid introducing PostCSS dependencies; instead we use lightweight regex/text checks.
 * - If your project provides a CSS parser util for tests, consider refactoring to use it here.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Helper to get CSS file contents reliably
function loadCss(): string {
  const cssPath = resolve(process.cwd(), 'src/style/app-fixed.module.css');
  if (!existsSync(cssPath)) {
    throw new Error('Expected CSS file at src/style/app-fixed.module.css not found');
  }
  const raw = readFileSync(cssPath, 'utf8');
  // Normalize whitespace to make regex more robust across formatting changes
  return raw.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ');
}

function getSelectors(css: string): string[] {
  // Very naive selector extraction: get text up to first '{' per rule
  const selectors: string[] = [];
  const re = /([^{}]+)\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    const sel = m[1].trim();
    if (sel) selectors.push(sel);
  }
  return selectors;
}

describe('app-fixed.module.css', () => {
  let css: string;

  beforeAll(() => {
    css = loadCss();
  });

  it('should not be empty and should end with a closing brace "}"', () => {
    expect(css.length).toBeGreaterThan(20);
    expect(css.trim().endsWith('}')).toBe(true);
  });

  it('contains no unmatched curly braces', () => {
    const opens = (css.match(/\{/g) || []).length;
    const closes = (css.match(/\}/g) || []).length;
    expect(opens).toBe(closes);
  });

  it('defines expected CSS modules class selectors (diff-focused)', () => {
    // Adjust these to align with your recent diff; include newly added/renamed classes here.
    // root wrapper
    expect(/\.app\b[^{]*\{/.test(css)).toBe(true);
    // layout container
    expect(/\.container\b[^{]*\{/.test(css)).toBe(true);
    // main content region
    expect(/\.content\b[^{]*\{/.test(css)).toBe(true);
    // sticky/fixed sidebar
    expect(/\.sidebar\b[^{]*\{/.test(css)).toBe(true);
    // sticky helper
    expect(/\.sticky\b[^{]*\{/.test(css)).toBe(true);
    // utility class
    expect(/\.hidden\b[^{]*\{/.test(css)).toBe(true);
  });

  it('ensures no duplicate class rule definitions for key selectors', () => {
    // Check no duplicates for container
    const matchesContainer = css.match(/\.container\b[^{]*\{/g) || [];
    expect(matchesContainer.length).toBeLessThanOrEqual(1);
    // Check no duplicates for content
    const matchesContent = css.match(/\.content\b[^{]*\{/g) || [];
    expect(matchesContent.length).toBeLessThanOrEqual(1);
    // Check no duplicates for sidebar
    const matchesSidebar = css.match(/\.sidebar\b[^{]*\{/g) || [];
    expect(matchesSidebar.length).toBeLessThanOrEqual(1);
  });

  it('exposes design tokens as CSS custom properties on :root or a top-scope selector', () => {
    // Look for common tokens; adapt to match your diff (e.g., spacing, radius, z-index).
    const rootBlock = (css.match(/:root\s*\{([\s\S]*?)\}/) || [])[1] || css; // fallback to global scan
    expect(/--container-max-width\s*:\s*[^;]+;/.test(rootBlock)).toBe(true);
    expect(/--sidebar-width\s*:\s*[^;]+;/.test(rootBlock)).toBe(true);
    expect(/--gutter\s*:\s*[^;]+;/.test(rootBlock)).toBe(true);
    expect(/--z-sticky\s*:\s*[^;]+;/.test(rootBlock)).toBe(true);
  });

  it('declares sticky behavior without breaking positioning contracts', () => {
    // Validate sticky usage (position: sticky; top: <value>)
    const stickyBlock = css.match(/\.sticky[^{]*\{([\s\S]*?)\}/);
    expect(!!stickyBlock).toBe(true);
    const body = stickyBlock ? stickyBlock[1] : '';
    expect(/position\s*:\s*sticky\s*;/.test(body)).toBe(true);
    expect(/top\s*:\s*(?:var\([^)]+\)|-?\d+(\.\d+)?(px|rem|em|vh|%)?)\s*;/.test(body)).toBe(true);
    // Ensure not using conflicting position values
    expect(/position\s*:\s*(fixed|absolute)\s*;/.test(body)).toBe(false);
  });

  it('enforces responsive breakpoints via media queries', () => {
    // Look for at least one min-width and one max-width media query used to adjust layout
    const hasMin = /@media[^{]*\(min-width\s*:\s*[^)]+\)\s*\{/.test(css);
    const hasMax = /@media[^{]*\(max-width\s*:\s*[^)]+\)\s*\{/.test(css);
    expect(hasMin || hasMax).toBe(true);

    // Ensure container adjusts at breakpoint (commonly width or padding changes)
    const containerAtMQ = /@media[\s\S]*?\.container[^{]*\{[\s\S]*?(width|max-width|padding|grid-template-columns)\s*:\s*[^;]+;[\s\S]*?\}/.test(css);
    expect(containerAtMQ).toBe(true);
  });

  it('does not set overflow hidden on content container inadvertently (regression guard)', () => {
    // Prevent clipping content if a previous diff accidentally added overflow hidden broadly
    const contentBlock = css.match(/\.content[^{]*\{([\s\S]*?)\}/);
    if (contentBlock) {
      expect(/overflow\s*:\s*hidden\s*;/.test(contentBlock[1])).toBe(false);
    } else {
      // If no content block, ensure a generic rule isn't hiding overflow globally
      expect(/body[^{]*\{[\s\S]*overflow\s*:\s*hidden\s*;/.test(css)).toBe(false);
      expect(/\.app[^{]*\{[\s\S]*overflow\s*:\s*hidden\s*;/.test(css)).toBe(false);
    }
  });

  it('ensures z-index tokens are used consistently for sticky elements', () => {
    // Sticky and sidebar should use either a token or a numeric value; warn if negative
    const sticky = css.match(/\.sticky[^{]*\{([\s\S]*?)\}/)?.[1] ?? '';
    const sidebar = css.match(/\.sidebar[^{]*\{([\s\S]*?)\}/)?.[1] ?? '';
    const zExpr = /z-index\s*:\s*(var\([^)]+\)|-?\d+)\s*;/;

    const s1 = sticky.match(zExpr);
    const s2 = sidebar.match(zExpr);
    expect(!!(s1 || s2)).toBe(true);

    const anyNegative = [s1?.[1], s2?.[1]].some(v => typeof v === 'string' && /^-/.test(v));
    expect(anyNegative).toBe(false);
  });

  it('contains no obvious invalid property declarations', () => {
    // Quick scan to catch common typos (e.g., widht, positon)
    expect(/\bwidht\b/i.test(css)).toBe(false);
    expect(/\bheigth\b/i.test(css)).toBe(false);
    expect(/\bpositon\b/i.test(css)).toBe(false);
    expect(/\bdispay\b/i.test(css)).toBe(false);
    expect(/\balignt-items\b/i.test(css)).toBe(false);
    expect(/\bmarign\b/i.test(css)).toBe(false);
    expect(/\bpaddng\b/i.test(css)).toBe(false);
  });

  it('does not over-qualify selectors for CSS Modules (no tag + class combos for module classes)', () => {
    // Discourage patterns like div.container in CSS Modules
    const selectors = getSelectors(css);
    const overQualified = selectors.filter(s => /\b[a-z]+\s*\.\w/.test(s) && !/^:/.test(s));
    expect(overQualified.length).toBe(0);
  });
});