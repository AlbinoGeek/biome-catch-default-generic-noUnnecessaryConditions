interface Details {
  details: Record<string, string>
}

declare function plain(): Promise<Details>
declare function sure(): Details

// Standard Promise.catch: got is Details | null, so ?. is needed.
export async function viaPromise(): Promise<Record<string, string>> {
  const got = await plain().catch(() => null)
  return got?.details ?? {}
}

// True positive: got can never be nullish.
export function truePositive(): Record<string, string> {
  const got = sure()
  return got?.details ?? {}
}
