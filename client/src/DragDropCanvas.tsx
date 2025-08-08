import React, { useState, useEffect, useRef } from 'react';
import { SHAPE_COLORS } from './styles';

export interface ISquare {
  x: number;
  y: number;
  size: number;
}

const DragDropCanvas: React.FC<{
  squares: ISquare[];
  setSquares: (_: ISquare[]) => void;
}> = ({ squares, setSquares }) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [startDragOffset, setStartDragOffset] = useState({ x: 0, y: 0 });
  const [shapesBoundingBox, setShapesBoundingBox] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [bestArea, setBestArea] = useState<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawSquares(ctx, squares);
  }, [squares]);

  const getShapesBoundingBoxArea = () => {
    let area =
      (shapesBoundingBox.x2 - shapesBoundingBox.x1) * (shapesBoundingBox.y2 - shapesBoundingBox.y1);
    area /= 1000;

    return area;
  };

  // @ts-ignore
  const drawSquares = (ctx, squares) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas

    for (let i = 0; i < squares.length; i++) {
      const square = squares[i];
      ctx.fillStyle = SHAPE_COLORS[i % SHAPE_COLORS.length];
      ctx.fillRect(square.x, square.y, square.size, square.size);
    }

    const newShapesBoundingBox = getShapesBoundingBox(squares);
    setShapesBoundingBox(newShapesBoundingBox);
    const minArea = Math.min(bestArea || Infinity, getShapesBoundingBoxArea());
    if (minArea != 0) {
      setBestArea(minArea);
    }

    const { x1, y1, x2, y2 } = shapesBoundingBox;
    ctx.strokeStyle = 'red';
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  };

  const handleMouseDown = (e: any) => {
    // @ts-ignore
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    // Check if mouse is inside the square
    for (let i = 0; i < squares.length; i++) {
      const square = squares[i];
      if (
        mouseX >= square.x &&
        mouseX <= square.x + square.size &&
        mouseY >= square.y &&
        mouseY <= square.y + square.size
      ) {
        setIsDragging(i);
        setStartDragOffset({ x: mouseX - square.x, y: mouseY - square.y });
      }
    }
  };

  const getShapesBoundingBox = (squares: ISquare[]) => {
    let x1 = squares[0]?.x;
    let y1 = squares[0]?.y;
    let x2 = squares[0]?.x + squares[0]?.size;
    let y2 = squares[0]?.y + squares[0]?.size;

    for (let i = 1; i < squares.length; i++) {
      const square = squares[i];
      x1 = Math.min(x1, square.x);
      y1 = Math.min(y1, square.y);
      x2 = Math.max(x2, square.x + square.size);
      y2 = Math.max(y2, square.y + square.size);
    }

    return { x1, y1, x2, y2 };
  };

  const detectOverlap = (x: number, y: number, size: number, staticSquare: ISquare) => {
    return (
      x < staticSquare.x + staticSquare.size &&
      x + size > staticSquare.x &&
      y < staticSquare.y + staticSquare.size &&
      y + size > staticSquare.y
    );
  };
  const detectAllShapesOverlap = (movingSquare: ISquare, squareIndex: number) => {
    for (let i = 0; i < squares.length; i++) {
      if (i === squareIndex) {
        continue;
      }
      const otherSquare = squares[i];
      if (detectOverlap(movingSquare.x, movingSquare.y, movingSquare.size, otherSquare)) {
        return true;
      }
    }
    return false;
  };

  const handleMouseMove = (e: any) => {
    if (isDragging !== null && canvasRef?.current) {
      //@ts-ignore
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const square = squares[isDragging];
      const newSquareX = Math.floor(mouseX - startDragOffset.x);
      const newSquareY = Math.floor(mouseY - startDragOffset.y);

      const newSquares = [...squares];
      newSquares[isDragging] = {
        ...square,
        // x: canMoveX ? newSquareX : square.x,
        // y: canMoveY ? newSquareY : square.y
      };

      // check if square is overlapping any other square
      const dX = newSquareX - square.x < 0 ? -1 : 1;
      const dY = newSquareY - square.y < 0 ? -1 : 1;
      for (let deltaX = newSquareX - square.x; deltaX != 0; deltaX -= dX) {
        const testSquareX = square.x + deltaX;
        if (!detectAllShapesOverlap({ ...square, x: testSquareX }, isDragging)) {
          newSquares[isDragging].x = testSquareX;
          break;
        }
      }
      for (let deltaY = newSquareY - square.y; deltaY != 0; deltaY -= dY) {
        const testSquareY = square.y + deltaY;
        if (!detectAllShapesOverlap({ ...square, y: testSquareY }, isDragging)) {
          newSquares[isDragging].y = testSquareY;
          break;
        }
      }

      setSquares(newSquares);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  return (
    <div style={{}}>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          WebkitUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            marginTop: 50,
            // color: 'grey',
          }}
        >
          Area: {getShapesBoundingBoxArea().toFixed(1)} <br />
          {/* <span style={{ fontWeight: 'bold' }}>Best:</span>&nbsp; */}
          Best: {bestArea?.toFixed(1) || 0 > 0 || '-'}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={viewportWidth}
        height={viewportHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp} // Stop dragging when mouse leaves the canvas
        style={{ border: '1px solid black', width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default DragDropCanvas;
