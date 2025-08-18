export function pagination(q: any) {
  const page = Math.max(1, Number(q.page ?? 1));
  const limit = Math.min(100, Math.max(1, q.limit ?? 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
