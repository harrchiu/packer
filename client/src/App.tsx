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
      {
        x: 0,
        y: 0,
        size: 50,
      },
      {
        x: 70,
        y: 70,
        size: 100,
      },
      {
        x: 200,
        y: 200,
        size: 70,
      },
      {
        x: 300,
        y: 300,
        size: 70,
      },
    ] 
    || randomSquares()
  );

  // useEffect(() => {
  //   setSquares(randomSquares());
  // }, []);

  return (
    <>
      <DragDropCanvas squares={squares} setSquares={setSquares} />
    </>
  );
}

export default App;
