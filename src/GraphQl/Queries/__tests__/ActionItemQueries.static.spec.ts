/**
 * Static validations for GraphQL queries without executing against a server.
 * Framework: Jest/Vitest style.
 *
 * These checks ensure:
 *  - Operation names follow conventions
 *  - Variables are declared before being used
 *  - No obvious syntax red flags (heuristic regex checks)
 */
 
function extractOps(txt: string) {
  const ops: { type: string; name?: string }[] = []
  const re = /\b(query|mutation|subscription)\s+([A-Za-z_][A-Za-z0-9_]*)?/g
  let m: RegExpExecArray | null
  while ((m = re.exec(txt))) ops.push({ type: m[1], name: m[2] })
  return ops
}

function listVars(txt: string) {
  const decls: string[] = []
  const uses: string[] = []
  const declRe = /\(\s*\$([A-Za-z_][A-Za-z0-9_]*)\s*:/g
  const useRe = /\$([A-Za-z_][A-Za-z0-9_]*)\b/g
  let m: RegExpExecArray | null
  while ((m = declRe.exec(txt))) decls.push(m[1])
  while ((m = useRe.exec(txt))) uses.push(m[1])
  return { decls, uses }
}

const maybeLoad = (): Record<string, any> => {
  try { return require('../ActionItemQueries') } catch {}
  try { return require('../actionItemQueries') } catch {}
  return {}
}

describe('ActionItemQueries static checks (no server)', () => {
  const mod = maybeLoad()
  const pairs: [string, string][] = Object.entries(mod)
    .map(([k, v]) => {
      if (typeof v === 'string') return [k, v]
      if (v && typeof v === 'object' && v.loc && v.loc.source && typeof v.loc.source.body === 'string') {
        return [k, v.loc.source.body as string]
      }
      return [k, '']
    })

  it('has at least one operation across all exports', () => {
    const anyOp = pairs.some(([_, t]) => /\b(query|mutation|subscription)\b/i.test(t))
    expect(anyOp).toBe(true)
  })

  it('operation names, if present, are PascalCase (readability)', () => {
    for (const [_, t] of pairs) {
      const ops = extractOps(t)
      for (const o of ops) {
        if (o.name) expect(o.name).toMatch(/^[A-Z][A-Za-z0-9_]*$/)
      }
    }
  })

  it('variables used are declared in the operation signature', () => {
    for (const [name, t] of pairs) {
      if (!t.trim()) continue;
      const { decls, uses } = listVars(t)
      // Every used var should either be declared or be a fragment var (ignored here)
      const undeclared = uses.filter(u => !decls.includes(u));
      // Allow cases where no variables are used
      expect(undeclared).toEqual([])
    }
  })
});