import { useEffect, useState } from 'react';
import './App.css';
import DragDropCanvas, { ISquare } from './DragDropCanvas';

function App() {
  // randomly generate squares and set
  const randomSquares = () => {
    const newSquares = [];
    for (let i = 0; i < 3; i++) {
      newSquares.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        size: Math.random() * 100 + 50,
      });
    }
    return newSquares;
  };
  const [squares, setSquares] = useState<ISquare[]>(
    [
      // {
      //   x: 200,
      //   y: 200,
      //   size: 50,
      // },
    ] || randomSquares()
  );

  useEffect(() => {
    setSquares(randomSquares());
  }, []);

  return (
    <>
      <DragDropCanvas squares={squares} setSquares={setSquares} />
    </>
  );
}

export default App;
