import {useEffect, useState} from 'react'
import {Home, Logo, PlayArea, GameOver} from './';
import './css/Game.scss';

let gameOverProps = {};
function Game() {
  const [player, setPlayer] = useState("O");
  const [start, setStart] = useState(false);
  const [showPlayArea, setShowPlayArea] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({
    "user": 0,
    "tie": 0,
    "cpu": 0
  });
  
  useEffect(()=> {
    const scores = JSON.parse(localStorage.getItem('scores'));
    const gamePlayer = localStorage.getItem('player');
    const gameStart = localStorage.getItem('gameStart');
    if(gameStart) {
      setStart(true);
      setShowPlayArea(true);
    }
    if(gamePlayer) setPlayer(gamePlayer);
    if(scores) setScores(scores);
  }, [])
  
  const handleQuit = () => {
    localStorage.clear();
    gameOverProps.clearBoxes();
    setScores({"user": 0, "tie": 0, "cpu": 0});
    setGameOver(false);
    setStart(false);
    setShowPlayArea(false);
    setPlayer("O");
  }

  const handlePlayAgain=()=> {
    setGameOver(false);
    gameOverProps.clearBoxes();
  }

  const handleGameOver = (gameOverData)=> {
    gameOverProps = gameOverData;
    setGameOver(true);
  } 

  const updateScores = (winner) => {
    localStorage.setItem('scores', JSON.stringify({...scores, [winner]: scores[winner]+1}));
    setScores((prevScores)=> ({...prevScores, [winner]: prevScores[winner]+1}));
  }

  return (
    <div className='game-box'>
        <div className="logo" style={(start && !showPlayArea) ? {animation: "slide-text linear both 0.7s"} : (start && showPlayArea)? {left: "4rem"} : null}>
                <Logo>X</Logo>
                {"  "}
                <Logo>O</Logo>
        </div>
        {!start ?
            <Home player={player} changePlayer={(player) => setPlayer(player)} gameStarts={() => {
              setStart(true);
              localStorage.setItem('player', player);
              localStorage.setItem('gameStart', true);
              setTimeout(()=>setShowPlayArea(true), 1000);
            }} />
            : showPlayArea && <PlayArea player={player} scores={scores} updateScores={updateScores} handleGameOver={handleGameOver}
            />
        }
        {
          gameOver &&
            <div className='game-box game-over-box'>
            <GameOver {...gameOverProps} handleQuit={handleQuit} handlePlayAgain={handlePlayAgain} handleClosePopup={()=> setGameOver(false)}/>
            </div>
        }
    </div>
  )
}

export default Game