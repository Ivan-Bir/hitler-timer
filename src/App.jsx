import React, { useState, useRef, useEffect } from 'react';
// import beepSound from './sounds/beep.mp3';
// import tickSound from './sounds/tick.mp3';

const App = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [mode, setMode] = useState(null);

  // Значения для режимов
  const [threeMinutesValue, setThreeMinutesValue] = useState(180);
  const [oneMinuteValue, setOneMinuteValue] = useState(60);

  const [showSettings, setShowSettings] = useState(false);
  const [newThreeMinutes, setNewThreeMinutes] = useState('');
  const [newOneMinute, setNewOneMinute] = useState('');

  const timerRef = useRef(null);
  // const beepRef = useRef(new Audio(beepSound));
  // const tickRef = useRef(new Audio(tickSound));

  // Обновление таймера каждую секунду
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
            // beepRef.current.play();
            console.log('beepRef');
          }

          if (prev <= 10) {
            // tickRef.current.play();
            console.log('tickRef');
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  // Сброс таймера
  const resetTimer = () => {
    setTimeLeft(0);
    setIsRunning(false);
    setIsWarning(false);
    setMode(null);
  };

  // Установка времени на 3 минуты
  const setThreeMinutes = () => {
    setTimeLeft(threeMinutesValue);
    setIsRunning(true);
    setIsWarning(false);
    setMode('threeMinutes');
  };

  // Установка времени на 1 минуту
  const setOneMinute = () => {
    setTimeLeft(oneMinuteValue);
    setIsRunning(true);
    setIsWarning(false);
    setMode('oneMinute');
  };

  // Пауза и возобновление таймера по клику
  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  // Изменение цвета цифр при определённом времени
  useEffect(() => {
    if ((mode === 'threeMinutes' && timeLeft <= 30 && timeLeft > 0) || (mode === 'oneMinute' && timeLeft <= 15 && timeLeft > 0)) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }
  }, [timeLeft, mode]);

  // Открытие/закрытие настроек
  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  // Сохранение новых значений режимов
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

      <div className={`timer ${isWarning ? 'warning' : ''}`} onClick={toggleTimer}>
        {formatTime()}
      </div>
      <div className="buttons">
        <button onClick={resetTimer}>Сброс</button>
        <button onClick={setThreeMinutes}>Голосование</button>
        <button onClick={setOneMinute}>Действие Президента</button>
      </div>
    </div>
  );
};

export default App;

