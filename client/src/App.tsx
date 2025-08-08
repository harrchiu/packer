import { useEffect, useState } from 'react';
import './App.css';
import DragDropCanvas, { ISquare } from './DragDropCanvas';

function App() {
  // randomly generate squares and set
  const randomSquares = () => {
    const newSquares = [];
    let xy = 100;
    for (let i = 0; i < 5; i++) {
      const newSquare = {
        x: xy,
        y: xy,
        size: Math.floor(Math.random() * 50) + 10,
      };
      newSquares.push(newSquare);
      xy += newSquare.size + 25;
    }
    return newSquares;
  };
  const [squares, setSquares] = useState<ISquare[]>(
    // [] ||
    randomSquares()
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
