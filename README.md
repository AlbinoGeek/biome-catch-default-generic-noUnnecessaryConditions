# noUnnecessaryConditions: a Promise subclass's `catch<TResult = never>` default

Biome 2.6.9 reports `got?.details ?? {}` as unnecessary when `got` comes from `await task.catch(() => null)` and `task` is a `Promise` subclass whose `catch` declares `<TResult = never>`, the way Wails' `CancellablePromise` does. TypeScript infers `TResult = null` from the callback, so `got` is `Details | null` and both checks are needed. Biome uses the default (`never`) instead, and `got` becomes `Details`.

```sh
npm ci
npm run repro      # Biome 2.6.9: 4 errors (2 false, at src/repro.ts:13:10)
npm run typecheck  # tsc 7.0.2: exit 0; the @ts-expect-error in proof() holds, so got is Details | null
npm run oxlint     # oxlint type-aware: control.ts only
npm run eslint     # typescript-eslint on the TypeScript 6 API: control.ts only
```

## Results

| Tool | `src/repro.ts` (subclass `catch`) | `control.ts` `viaPromise` (plain `Promise.catch`) | `control.ts` `truePositive` |
| --- | --- | --- | --- |
| Biome 2.6.9 | reported (false positive) | not reported | reported |
| Biome 2.6.8 | not reported | not reported | reported |
| tsc 7.0.2, tsc 6.0.3 | `got: Details \| null` | `got: Details \| null` | `got: Details` |
| typescript-eslint 8.74.0 `no-unnecessary-condition` (TS 6.0.3) | not reported | not reported | reported |
| oxlint 1.95.0 + oxlint-tsgolint 7.0.2008 `typescript/no-unnecessary-condition` | not reported | not reported | reported |

So 2.6.9 is a regression against 2.6.8, and it disagrees with TypeScript and with both other type-aware linters, which all still catch the true positive.

## Culprit

[#13184](https://github.com/biomejs/biome/pull/13184) (3f72ebe, "resolve class method type parameters in the method scope"), released in 2.6.9. Built from source and run with `--only=suspicious/noUnnecessaryConditions`:

| Commit | Errors | `src/repro.ts:13:10` |
| --- | --- | --- |
| a1c2950 (parent) | 2 | not reported |
| 3f72ebe | 4 | reported |

A method type parameter with a default now resolves to that default where TypeScript infers it from the argument.
