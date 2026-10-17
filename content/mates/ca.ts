export const timesTables = {
  title: "Taules",
  symbol: "×",
  count: 8,
};

export type Problem = {
  left: number;
  right: number;
  symbol: string;
  answer: number;
};

function randInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function makeProblems(): Problem[] {
  return Array.from({ length: timesTables.count }, () => {
    const left = randInt(1, 10);
    const right = randInt(1, 10);
    return {
      left,
      right,
      symbol: timesTables.symbol,
      answer: left * right,
    };
  });
}
