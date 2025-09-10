/**
 * Tests for app-fixed.module.css
 * Framework: Jest/Vitest BDD-style globals (describe/it/expect).
 * No external dependencies: parses CSS as text to validate structure and invariants.
 *
 * Why text-based: Avoid introducing new parser deps; still provides valuable coverage:
 * - Ensures critical custom properties exist
 * - Ensures selectors and declarations added in the diff are present
 * - Catches common mistakes (undefined variables, missing semicolons, duplicated tokens on one line)
 */

import fs from 'fs';
import path from 'path';

const CSS_PATH = path.resolve(process.cwd(), 'src/style/app-fixed.module.css');

function readCss(): string {
  const css = fs.readFileSync(CSS_PATH, 'utf8');
  expect(css.length).toBeGreaterThan(0);
  return css;
}

function getCustomProperties(css: string): Set<string> {
  // Capture --var-name: value; within :root { ... }
  // This is a relaxed matcher to tolerate spacing and values.
  const rootBlockMatch = css.match(
    new RegExp(':root[ \\t]*\\{([^]*?)\\}[ \\t]*', 'm')
  );
  const block = rootBlockMatch ? rootBlockMatch[1] : '';
  const props = new Set<string>();
  // Match lines like: --foo-bar: value;
  const re = new RegExp('--([a-zA-Z0-9-]+)[ \\t]*:[ \\t]*[^;]+;', 'g');
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) {
    props.add(`--${m[1]}`);
  }
  return props;
}

function getAllVarUsages(css: string): Set<string> {
  const re = new RegExp('var\\(\\s*(--[a-zA-Z0-9-]+)\\s*(?:,[^)]+)?\\)', 'g');
  const vars = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    vars.add(m[1]);
  }
  return vars;
}

describe('app-fixed.module.css', () => {
  let css: string;

  beforeAll(() => {
    css = readCss();
  });

  describe(':root custom properties', () => {
    it('defines core theme variables added in the diff', () => {
      const definedVars = getCustomProperties(css);
      const expected = [
        '--primary-theme-color',
        '--addButton-font',
        '--addButton-bg',
        '--addButton-bg-hover',
        '--disabled-btn',
        '--unblockButton-bg',
        '--removeButton-bg',
        '--activeTab-bg',
        '--inactiveTab-bg',
        '--searchButton-bg',
        '--modalHeader-bg',
        '--switch-bg-checked',
        '--editButton-bg',
        '--regularBtn-bg',
        '--tableHeader-bg',
      ];
      for (const v of expected) {
        expect(definedVars.has(v)).toBeTruthy();
      }
    });

    it('does not contain lines with multiple custom properties missing a semicolon separator', () => {
      // Detect patterns like: --foo: val --bar: val;
      // These are invalid and likely introduced by accidental concatenation.
      const badPattern = /--[a-zA-Z0-9\-]+\s*:[^;]*\s+--[a-zA-Z0-9\-]+\s*:/;
      expect(badPattern.test(css)).toBeFalsy();
    });
  });

  describe('variable usage integrity', () => {
    it('does not reference undefined custom properties', () => {
      const definedVars = getCustomProperties(css);
      const used = getAllVarUsages(css);
      const undefinedRefs = Array.from(used).filter(v => !definedVars.has(v));
      // Known suspicious references from the diff may include --light-blue, --eventManagement-button-bg, --input-shadow.
      // This assertion will surface any undefined ones to keep the stylesheet sound.
      expect(undefinedRefs).toEqual([]);
    });
  });

  describe('selectors and declarations (happy paths)', () => {
    it('.addButton defines font, bg, and border using custom properties', () => {
      const block = css.match(/\.addButton\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(block).toMatch(/color:\s*var\(\s*--addButton-font\s*\)\s*;/);
      expect(block).toMatch(/border-color:\s*var\(\s*--addButton-bg\s*\)\s*;/);
      // Background references should use custom property
      expect(block).toMatch(/background-color:\s*var\(\s*--[a-zA-Z0-9\-]+\s*\)\s*\!?important?;/);
    });

    it('.addButton has :is(:hover, :active, :focus) state styles', () => {
      const state = css.match(/\.addButton:is\(\s*:hover\s*,\s*:active\s*,\s*:focus\s*\)\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(state).toMatch(/background-color:\s*var\(\s*--addButton-bg-hover\s*\)/);
      expect(state).toMatch(/border-color:\s*var\(\s*--addButton-border-hover\s*\)/);
    });

    it('.unblockButton and nested .unbanIcon hover color are styled via variables', () => {
      const btn = css.match(/\.unblockButton\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(btn).toMatch(/background-color:\s*var\(\s*--unblockButton-bg\s*\)\s*\!?important?;/);
      const hoverIcon = css.match(/\.unblockButton:hover\s+\.unbanIcon\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(hoverIcon).toMatch(/color:\s*var\(\s*--unbanIcon-color-hover\s*\)/);
    });

    it('.removeButton hover changes bg, border, and color via variables', () => {
      const state = css.match(/\.removeButton:is\(\s*:hover\s*,\s*:active\s*,\s*:focus\s*\)\s*\{([\s\S]*?)\}/m)?.[1]
        ?? css.match(/\.removeButton:is\(\s*:hover\s*,\s*:active\s*,\s*:focus\s*\)\s*\{([\s\S]*?)\}/m)?.[1] // robustness
        ?? css.match(/\.removeButton:is\([^}]+\)\s*\{([\s\S]*?)\}/m)?.[1]
        ?? '';
      expect(state).toMatch(/background-color:\s*var\(\s*--removeButton-bg-hover\s*\)/);
      expect(state).toMatch(/border-color:\s*var\(\s*--removeButton-border-hover\s*\)/);
      expect(state).toMatch(/color:\s*var\(\s*--removeButton-color-hover\s*\)/);
    });

    it('.activeTab and .inActiveTab define focus-visible outlines', () => {
      const activeFocus = css.match(/\.activeTab:focus-visible\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(activeFocus).toMatch(/outline:\s*2px\s+solid\s+var\(\s*--activeTab-outline-focus\s*\)\s*;/);
      const inactiveFocus = css.match(/\.inActiveTab:focus-visible\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(inactiveFocus).toMatch(/outline:\s*2px\s+solid\s+var\(\s*--inActiveTab-outline-focus\s*\)\s*;/);
    });

    it('.searchButton hover adds box-shadow and active scales with transform', () => {
      const hover = css.match(/\.searchButton:hover\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(hover).toMatch(/box-shadow:\s*var\(\s*--hover-shadow\s*\)\s*;/);
      const active = css.match(/\.searchButton:active\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(active).toMatch(/transform:\s*scale\(\s*0?\.95\s*\)\s*;/);
    });

    it('.modalHeader styles title and close button with variables', () => {
      const header = css.match(/\.modalHeader\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(header).toMatch(/background-color:\s*var\(\s*--modalHeader-bg\s*\)/);
      const title = css.match(/\.modalHeader\s+div,\s*\.modalHeader\s+\.modal-title\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(title).toMatch(/color:\s*var\(\s*--modalTitle-color\s*\)\s*\!?important?;/);
      const closeBtn = css.match(/\.modalHeader\s+button\.close,\s*\.modalHeader\s+\.btn-close\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(closeBtn).toMatch(/color:\s*var\(\s*--modalClose-button-color\s*\)/);
    });

    it('.switch input checked styles include bg, border, and shadow variables', () => {
      const checked = css.match(/\.switch\s+input:checked\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(checked).toMatch(/background-color:\s*var\(\s*--switch-bg-checked\s*\)/);
      expect(checked).toMatch(/border-color:\s*var\(\s*--switch-border-checked\s*\)/);
      expect(checked).toMatch(/box-shadow:\s*0\s+0\s+0\.1rem\s+0\.2rem\s+var\(\s*--switch-box-shadow-checked\s*\)\s*;/);
    });

    it('.editButton uses active and hover variables', () => {
      const base = css.match(/\.editButton\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(base).toMatch(/--bs-btn-active-bg:\s*var\(\s*--editButton-bg-active\s*\)\s*;/);
      const hover = css.match(/\.editButton:is\(\s*:hover\s*,\s*:active\s*\)\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(hover).toMatch(/background-color:\s*var\(\s*--editButton-bg-hover\s*\)/);
    });

    it('.regularBtn hover toggles bg, color, and border via variables', () => {
      const hover = css.match(/\.regularBtn:is\(\s*:hover\s*,\s*:active\s*\)\s*\{([\s\S]*?)\}/m)?.[1] ?? '';
      expect(hover).toMatch(/background-color:\s*var\(\s*--regularBtn-bg-hover\s*\)\s*\!?important?;/);
      expect(hover).toMatch(/border-color:\s*var\(\s*--regularBtn-border-hover\s*\)\s*\!?important?;/);
    });

    it('.tableHeader exists and is styled (multiple declarations allowed)', () => {
      const matches = css.match(/\.tableHeader\s*\{[\s\S]*?\}/mg) || [];
      expect(matches.length).toBeGreaterThanOrEqual(1);
      // At least one block should set background-color or font-weight as per diff
      expect(matches.join('\n')).toMatch(/background-color:\s*red|font-weight:\s*bold/);
    });
  });

  describe('failure-condition checks (edge cases from diff)', () => {
    it('does not duplicate the same custom property on a single line', () => {
      // Guards against patterns like: --colorPrimary-bg: #7c9beb; ... --colorPrimary-bg: #a8c7fa;
      // Duplicate across file is allowed by CSS cascade, but same-line repeats are suspicious.
      const sameLineDuplicate = /(--[a-zA-Z0-9\-]+)\s*:[^;\n]+;[^\n]*\1\s*:/;
      expect(sameLineDuplicate.test(css)).toBeFalsy();
    });

    it('every :is(...) selector targets at least one of :hover, :active, or :focus', () => {
      const isBlocks = css.match(/:is\(([^)]+)\)\s*\{/g) || [];
      for (const blk of isBlocks) {
        expect(/:hover|:active|:focus/.test(blk)).toBeTruthy();
      }
    });
  });
});