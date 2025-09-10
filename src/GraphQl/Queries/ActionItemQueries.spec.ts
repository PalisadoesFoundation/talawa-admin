/**
 * Test framework: Jest/Vitest style (describe/it/expect).
 * If project uses Vitest, ensure `import { describe, it, expect, vi } from 'vitest'`.
 * If project uses Jest, globals are typically available or import from '@jest/globals'.
 */

import { DocumentNode } from 'graphql'
let Queries: any

// Lazy-import to avoid module eval during test file parse if environment requires setup files
beforeAll(async () => {
  try {
    // Try multiple common paths for implementation to improve robustness
    try { Queries = await import('./ActionItemQueries') } catch { /* noop */ }
    if (!Queries) {
      try { Queries = await import('./actionItemQueries') } catch { /* noop */ }
    }
    if (!Queries) {
      try { Queries = await import('../../GraphQl/Queries/ActionItemQueries') } catch { /* noop */ }
    }
  } catch (e) {
    // Leave Queries as undefined; specific tests will assert presence
  }
});

describe('ActionItemQueries module shape', () => {
  it('should export at least one query or function', () => {
    expect(Queries).toBeTruthy()
    const keys = Object.keys(Queries || {})
    expect(keys.length).toBeGreaterThan(0)
  });

  it('exports should be DocumentNode or strings for gql queries', () => {
    if (!Queries) return;
    const values = Object.values(Queries)
    // Allow non-queries to co-exist (helpers), but at least one should be a query-like export
    const hasQueryLike = values.some((v: any) =>
      typeof v === 'string' ||
      (v && typeof v === 'object' && ('kind' in v || (v.loc && v.loc.source)))
    )
    expect(hasQueryLike).toBe(true)
  });
});

describe('ActionItemQueries query content validation', () => {
  const getAllExports = () => (Queries ? Object.entries(Queries) as [string, any][] : [])

  it('each exported query has a non-empty operation body', () => {
    for (const [name, val] of getAllExports()) {
      if (typeof val === 'string') {
        expect(val.trim()).not.toBe('')
        expect(val).toMatch(/\b(query|mutation|subscription)\b/i)
      } else if (val && typeof val === 'object') {
        // Likely a graphql-tag DocumentNode
        if ((val as DocumentNode).kind === 'Document') {
          const doc = val as DocumentNode
          expect(doc.definitions.length).toBeGreaterThan(0)
        }
      }
    }
  });

  it('operation names, if present, follow a readable PascalCase convention', () => {
    for (const [_, val] of getAllExports()) {
      if (typeof val === 'string') {
        const m = val.match(/\b(query|mutation|subscription)\s+([A-Za-z0-9_]+)/i)
        if (m && m[2]) {
          expect(m[2]).toMatch(/^[A-Z][A-Za-z0-9_]*$/)
        }
      }
    }
  });
});

describe('ActionItemQueries variable definitions and selection sets (static checks)', () => {
  const textOf = (v: any): string | null => {
    if (!v) return null;
    if (typeof v === 'string') return v
    // Try to stringify DocumentNode safely
    try {
      if (v && typeof v === 'object' && 'loc' in v && v.loc && v.loc.source && typeof v.loc.source.body === 'string') {
        return (v.loc as any).source.body as string
      }
    } catch {}
    return null
  }

  it('where applicable, queries should use variables ($) rather than hard-coded literals for identifiers', () => {
    if (!Queries) return;
    for (const [name, val] of Object.entries(Queries)) {
      const s = textOf(val)
      if (!s) continue;
      // Heuristic: if it selects by id, prefer $id not a raw literal like "123"
      if (/byId|getActionItem|actionItem/i.test(name) || /\bid\s*:\s*\$id\b/.test(s)) {
        const hasVariableId = /\(\s*\$id\s*:\s*[^)]+\)/.test(s) || /\bid\s*:\s*\$id\b/.test(s)
        expect(hasVariableId).toBe(true)
      }
    }
  });

  it('queries should avoid selecting wildcard/overly-broad fields; expect explicit field sets', () => {
    if (!Queries) return;
    for (const [_name, val] of Object.entries(Queries)) {
      const s = textOf(val)
      if (!s) continue;
      // Basic heuristic: selection sets with braces should contain named fields, not empty
      const hasSelection = /\{\s*[A-Za-z_][A-Za-z0-9_\s{):,$\!"#'%&()*+\-./;<=>?@[\]^`|~]*\}/.test(s)
      expect(hasSelection).toBe(true)
    }
  });
});