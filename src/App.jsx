import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import nomNom from './sounds/poedanie-ukus-yabloka.mp3';
import bgMusic from './sounds/f95d59c3e76296a.mp3';
import './App.css';

const ROWS = 15;
const COLS = 25;
const CELL_SIZE = 35; 

const App = () => {
  const [play] = useSound(nomNom);
  const [playBackgroundMusic, {stop}] = useSound(bgMusic, { loop: true });
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const resetGame = () => {
    stop();
    setIsGameOver(false)
    setScore(0);
    setSnake([{ x: 5, y: 5 }]);
    generateFood();
    playBackgroundMusic();
  };

  useEffect(() => {
    if(!isGameOver){
      playBackgroundMusic();
    }
  }, [playBackgroundMusic]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.keyCode) {
        case 37: 
          setDirection('LEFT');
          break;
        case 38:
          setDirection('UP');
          break;
        case 39:
          setDirection('RIGHT');
          break;
        case 40:
          setDirection('DOWN');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS)
    };

    setFood(newFood);
  };

  const moveSnake = () => {
    if (isGameOver) return;

    const head = { ...snake[0] };
  switch (direction) {
    case 'UP':
      head.y -= 1;
      break;
    case 'DOWN':
      head.y += 1;
      break;
    case 'LEFT':
      head.x -= 1;
      break;
    case 'RIGHT':
      head.x += 1;
      break;
    default:
      break;
  }


  const newSnake = [head, ...snake.slice(0, -1)];

  if (newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
    stop();
    setIsGameOver(true);
    return;
  }

  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    stop();
    setIsGameOver(true);
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    setScore(score + 1);
    if(score >= bestScore){
      setBestScore(score + 1);
    }
    play();
    generateFood();
    newSnake.push(snake[snake.length - 1]);
  }
    setSnake(newSnake);
  };

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 100);

    return () => {
      clearInterval(gameInterval);
    };
  }, [snake]);

  return (
    <div className="game-container">
      <div className="game-board">
        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: COLS }).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="cell"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: (food.x === colIndex && food.y === rowIndex) ? 'red' : (snake.some((segment) => segment.x === colIndex && segment.y === rowIndex) ? 'green' : 'rgb(35, 35, 35)')
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="infoboard">
        {isGameOver && <p style={{color:'red'}}>Game Over!</p>}
        <p>Score: {score}</p>
        <p>Best score: {bestScore}</p>
        <button className='btn' onClick={resetGame}>Restart Game</button>
      </div>
      
    </div>
  );
};

export default App;