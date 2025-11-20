"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>([
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
  ]);
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((col, idx) => {
          const newCol = [...col];
          newCol.pop(); // remove bottom
          newCol.unshift(randomFruit()); // add new at top
          return newCol;
        });
        return newGrid;
      });
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setIsSpinning(false);
    }, 2000);
  };

  const renderFruit = (fruit: Fruit) => {
    const src = `/${fruit.toLowerCase()}.png`;
    return (
      <img
        src={src}
        alt={fruit}
        width={64}
        height={64}
        className="mx-1"
      />
    );
  };

  const winCondition =
    !isSpinning &&
    (grid[0][0] === grid[0][1] && grid[0][1] === grid[0][2] ||
      grid[1][0] === grid[1][1] && grid[1][1] === grid[1][2] ||
      grid[2][0] === grid[2][1] && grid[2][1] === grid[2][2] ||
      grid[0][0] === grid[1][0] && grid[1][0] === grid[2][0] ||
      grid[0][1] === grid[1][1] && grid[1][1] === grid[2][1] ||
      grid[0][2] === grid[1][2] && grid[1][2] === grid[2][2]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <div key={`${colIdx}-${rowIdx}`} className="flex justify-center items-center">
              {renderFruit(fruit)}
            </div>
          ))
        )}
      </div>
      <Button onClick={spin} disabled={isSpinning}>
        {isSpinning ? "Spinning..." : "Spin"}
      </Button>
      {winCondition && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800 font-semibold">You won!</p>
          <Share text={`I just won a fruit combo on the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
