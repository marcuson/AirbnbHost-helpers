const threeLetterMonthToNumMap = {
  gen: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  mag: 5,
  giu: 6,
  lug: 7,
  ago: 8,
  set: 9,
  ott: 10,
  nov: 11,
  dic: 12,
};

export function threeLetterMonthToNum(month: string): number {
  return threeLetterMonthToNumMap[month];
}
