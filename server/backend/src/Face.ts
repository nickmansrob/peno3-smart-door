export function euclidDistance(point1: number[], point2: number[]): number {
  const sum = point1.map((point, index) => {
    return Math.pow((point - point2[index]), 2)
  }).reduce((previous, current) => previous + current, 0)
  return Math.sqrt(sum)
}
