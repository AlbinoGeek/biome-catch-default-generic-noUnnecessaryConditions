interface Details {
  details: Record<string, string>
}

declare class Task<T> extends Promise<T> {
  catch<TResult = never>(onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null): Task<T | TResult>
}

declare function prime(): Task<Details>

export async function load(): Promise<Record<string, string>> {
  const got = await prime().catch(() => null)
  return got?.details ?? {}
}

export async function proof(): Promise<void> {
  const got = await prime().catch(() => null)
  // @ts-expect-error got is Details | null
  const sure: Details = got
  void sure
}
