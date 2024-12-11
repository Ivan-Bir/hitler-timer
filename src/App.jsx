import React, { useState, useRef, useEffect } from 'react';
import remindSound from './sounds/remind.mp3';
import tickSound from './sounds/tick.mp3';

const App = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [mode, setMode] = useState(null);

  const [threeMinutesValue, setThreeMinutesValue] = useState(180);
  const [oneMinuteValue, setOneMinuteValue] = useState(60);

  const [showSettings, setShowSettings] = useState(false);
  const [newThreeMinutes, setNewThreeMinutes] = useState('');
  const [newOneMinute, setNewOneMinute] = useState('');

  const timerRef = useRef(null);
  const remindRef = useRef(new Audio(remindSound));
  const tickRef = useRef(new Audio(tickSound));

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return 0;
          }

          if ((prev - 1) % 30 === 0) {
            remindRef.current.play();
          }

          if (prev <= 10) {
            tickRef.current.play();
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const resetTimer = () => {
    setTimeLeft(0);
    setIsRunning(false);
    setIsWarning(false);
    setMode(null);
  };

  const setThreeMinutes = () => {
    setTimeLeft(threeMinutesValue);
    setIsRunning(true);
    setIsWarning(false);
    setMode('threeMinutes');
  };

  const setOneMinute = () => {
    setTimeLeft(oneMinuteValue);
    setIsRunning(true);
    setIsWarning(false);
    setMode('oneMinute');
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    if ((mode === 'threeMinutes' && timeLeft <= 30 && timeLeft > 0) || (mode === 'oneMinute' && timeLeft <= 15 && timeLeft > 0)) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }
  }, [timeLeft, mode]);

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  const saveSettings = () => {
    if (newThreeMinutes) setThreeMinutesValue(parseInt(newThreeMinutes));
    if (newOneMinute) setOneMinuteValue(parseInt(newOneMinute));
    setShowSettings(false);
    setNewThreeMinutes('');
    setNewOneMinute('');
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <button className="settings-button" onClick={toggleSettings}>
        Настройки
      </button>

      {showSettings && (
        <div className="settings-panel">
          <h3>Настройки</h3>
          <div className="input-group">
            <label>Голосование (секунды):</label>
            <input
              type="number"
              placeholder={threeMinutesValue}
              value={newThreeMinutes}
              onChange={(e) => setNewThreeMinutes(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Действие Президента (секунды):</label>
            <input
              type="number"
              placeholder={oneMinuteValue}
              value={newOneMinute}
              onChange={(e) => setNewOneMinute(e.target.value)}
            />
          </div>
          <button className="save-button" onClick={saveSettings}>
            Сохранить
          </button>
        </div>
      )}

      <div className="content-container">
        <div className="timer-container" onClick={toggleTimer}>
          <div className={`timer-rotated ${isWarning ? 'warning' : ''}`}>
            {formatTime()}
          </div>
          <div className={`timer ${isWarning ? 'warning' : ''}`}>
            {formatTime()}
          </div>
        </div>
        <div className="buttons">
          <button className="btn-reset" onClick={resetTimer}>Сброс</button>
          <div className="game-action-buttons">
            <button className="btn-vote" onClick={setThreeMinutes}>Голосование</button>
            <button className="btn-pres" onClick={setOneMinute}>Действие Президента</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default App;

