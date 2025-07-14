import '../styles/App.css';
import languages from '../data/languages.js';
import { useState } from 'react';
import { getFarewellText, getRandomWord } from '../utilis/utilis.js';
import Confetti from 'react-confetti';

export default function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  console.log(currentWord);

  const wrongGuessCount = guessedLetters.filter(
    (char) => !currentWord.includes(char)
  ).length;

  const isGameWon = currentWord
    .split('')
    .every((char) => guessedLetters.includes(char));
  const isGameLost = wrongGuessCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;

  const languagesElement = languages.map((languageObj, index) => {
    return (
      <li
        className={index < wrongGuessCount ? 'dead' : null}
        key={languageObj.name}
        style={{
          backgroundColor: languageObj.backgroundColor,
          color: languageObj.color,
        }}
      >
        {languageObj.name}
      </li>
    );
  });

  const currentWordElement = currentWord.split('').map((char, index) => {
    return (
      <span
        key={index}
        className={guessedLetters.includes(char) ? 'right' : 'incorrect'}
      >
        {guessedLetters.includes(char) || isGameOver ? char.toUpperCase() : ''}
      </span>
    );
  });

  function handleClick(char) {
    setGuessedLetters((prevLetters) =>
      prevLetters.includes(char) ? prevLetters : [...prevLetters, char]
    );
  }

  const displayDeadLanguages = () => {
    if (
      wrongGuessCount > 0 &&
      !currentWord.includes(guessedLetters[guessedLetters.length - 1])
    ) {
      return getFarewellText(languages[wrongGuessCount - 1].name);
    }
  };

  function gameStatus() {
    if (!isGameOver) {
      return displayDeadLanguages() ? <h2>{displayDeadLanguages()}</h2> : null;
    }

    if (isGameWon) {
      return (
        <>
          <h2>You Won!</h2>
          <p>You saved the world from reverting back to 720p. 😎</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2>You Lost!</h2>
          <p>RIP the computer world.</p>
        </>
      );
    }
  }

  function newGame() {
    setCurrentWord(() => getRandomWord());
    setGuessedLetters(() => []);
  }

  const keyboardElements = alphabet.split('').map((char) => {
    let btnClass = null;

    if (guessedLetters.includes(char)) {
      currentWord.includes(char)
        ? (btnClass = 'correct')
        : (btnClass = 'wrong');
    }

    return (
      <button
        key={char}
        onClick={() => handleClick(char)}
        className={btnClass}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(char)}
        aria-label={`Letter ${char}`}
      >
        {char}
      </button>
    );
  });

  return (
    <main>
      {isGameWon && (
        <Confetti width={window.innerWidth} height={innerHeight}></Confetti>
      )}
      <header className='game-header'>
        <h1>Assembly: Endgame</h1>
        <p>
          A modern twist on the classic game of Hangman. Uncover the word in 8
          tries or less to save the programming world from the horrors of
          assembly!
        </p>
      </header>
      <section
        className={[
          'endgame-result-container',
          isGameWon && 'winner',
          isGameLost && 'loser',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-live='polite'
        role='status'
      >
        {gameStatus()}
      </section>
      <section className='languages-container'>
        <ul>{languagesElement}</ul>
      </section>
      <section className='word-container'>{currentWordElement}</section>
      <section className='sr-only' aria-live='polite' role='status'>
        <p>
          {currentWord.includes(
            guessedLetters[guessedLetters.length - 1]
              ? `You guessed the letter ${
                  guessedLetters[guessedLetters.length - 1]
                } correctly!`
              : `You guessed the letter ${
                  guessedLetters[guessedLetters.length - 1]
                } incorrectly!`
          )}
          You have {languages.length - 1} attempts left.
        </p>
        <p>
          Current word:{' '}
          {currentWord
            .split('')
            .map((char) =>
              guessedLetters.includes(char) ? char + '.' : 'blank'
            )
            .join(' ')}
        </p>
      </section>
      <section className='keyboard-container'>{keyboardElements}</section>
      {isGameOver && (
        <button className='replay-btn' onClick={newGame}>
          New Game
        </button>
      )}
    </main>
  );
}
