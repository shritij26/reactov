import { useState, useRef, useEffect } from "react";
import MainHeading from "./components/MainHeading";
import SubHeading from "./components/SubHeading";
import Button from "./components/Button";
import "./App.css";
import startSound from "./assets/Start.mp3";
import tooSoonSound from "./assets/TooSoon.mov";
import successSound from "./assets/success.mp3";

function App() {
  const [gameState, setGameState] = useState("idle");
  const [reactionTime, setReactionTime] = useState(0);
  const [timer, setTimer] = useState(0);

  const startAudio = new Audio(startSound);
  const tooSoonAudio = new Audio(tooSoonSound);
  const successAudio = new Audio(successSound);

  const startTimeRef = useRef(null);
  const waitTimeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // START GAME
  const startGame = () => {
    startAudio.play();
    setGameState("waiting");
    setTimer(0);

    // random wait between 2–5 sec
    const waitTime = Math.random() * 3000 + 2000;

    waitTimeoutRef.current = setTimeout(() => {
      setGameState("ready");
      startTimeRef.current = Date.now();
      startStopwatch();
    }, waitTime);
  };

  // STOPWATCH
  const startStopwatch = () => {
    intervalRef.current = setInterval(() => {
      setTimer(Date.now() - startTimeRef.current);
    }, 10);
  };

  const stopStopwatch = () => {
    clearInterval(intervalRef.current);
  };

  // SCREEN CLICK
  const handleScreenClick = () => {
    if (gameState === "waiting") {
      tooSoonAudio.play();
      clearTimeout(waitTimeoutRef.current);
      setGameState("tooSoon");
    }

    if (gameState === "ready") {
      successAudio.play();
      stopStopwatch();
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setGameState("result");
    }
  };

  // RESET
  const resetGame = () => {
    setGameState("idle");
    setReactionTime(0);
    setTimer(0);
  };

  // CLEANUP
  useEffect(() => {
    return () => {
      clearTimeout(waitTimeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className={`app ${gameState}`} onClick={handleScreenClick}>
      {gameState === "idle" && (
        <>
          <MainHeading />
          <SubHeading />
          <Button text="START" onClick={startGame} />
        </>
      )}

      {gameState === "waiting" && <h1 className="wait-text">WAIT...</h1>}

      {gameState === "ready" && (
        <>
          <h1 className="click-text">CLICK!</h1>
          <div className="stopwatch">{timer} ms</div>
        </>
      )}

      {gameState === "tooSoon" && (
        <>
          <h1 className="too-soon">TOO SOON!</h1>
          <p className="hint">WAIT FOR <span>GREEN</span></p>
          <Button text="TRY AGAIN" onClick={resetGame} outline />
        </>
      )}

      {gameState === "result" && (
        <>
          <p className="your-time">YOUR TIME</p>
          <h1 className="result">{reactionTime} ms</h1>
          <p className="keep">KEEP PRACTICING!</p>
          <Button text="PLAY AGAIN" onClick={resetGame} outline />
        </>
      )}
    </div>
  );
}

export default App;


