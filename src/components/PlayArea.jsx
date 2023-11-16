import React, { useCallback, useEffect, useRef, useState } from 'react'
import './css/PlayArea.scss';
import {Logo} from './';

let markedIndexes = [];
function PlayArea({
    player,
    handleGameOver,
    scores,
    updateScores,
}) {
    const [inputs, setInputs] = useState(Array.from({length: 9}, (_)=> ""));
    const [turn, setTurn] = useState(player);
    const ticTacRef = useRef();
    
    useEffect(()=> {
        if(turn !== player) {
            setTimeout(()=> {
                const blockIndex = findBlockChoice(markedIndexes[markedIndexes.length-1]);
                blockIndex < 0 ? markInput(findBestChoice()) : markInput(blockIndex);
                ticTacRef.current.style.pointerEvents = "auto";
            }, 1000)
        }
        
    }, [turn])
    
    useEffect(()=> {
        if(markedIndexes.length >= 5) {
            //check for winning or all input boxes are filled.
            const isWin = checkWinning(markedIndexes[markedIndexes.length-1]);
            if(isWin || markedIndexes.length === 9) return gameOver(isWin);
        }
        
        markedIndexes.length > 0 && (turn === player)? setTurn(player==="X"? "O" : "X") : setTurn(player);
        
        
    }, [inputs])
    
    const checkWinning = useCallback((index)=> {
        let rowCount = 0, colCount = 0;
        //Row & Column Check
        let rowIndex = Math.floor(index/3)*3, colIndex = index % 3;
        const rowEnd = rowIndex+3, colEnd = colIndex+6;
        
        while(rowIndex<rowEnd && colIndex<=colEnd) {
            inputs[rowIndex] === turn && rowCount++;
            inputs[colIndex] === turn && colCount++;
            
            rowIndex++;
            colIndex+=3;
        }
        
        if(rowCount===3 || colCount===3) return true;
        
        //Diagonal Check
        if(index%2 === 0) {
            let diagonalCount = 0;
            if(index%4 === 0) for(let d=0; d<=8; d+=4) {
                inputs[d] === turn && diagonalCount++;
            }
            
            if(diagonalCount === 3) return true;
            else {
                diagonalCount = 0;
                if(index===4 || index%4!==0) for(let d=2; d<=6; d+=2) {
                    inputs[d] === turn && diagonalCount++;
                }
                if(diagonalCount === 3) return true;
            }
        }
        
        return false;
        
    }, [inputs])
    
    const gameOver = (isWin) => {
        markedIndexes = [];
        (turn !== player)? ticTacRef.current.style.pointerEvents = "none" : null;
        let gameOverProps = {};
        setTimeout(() => {
            isWin ?
                gameOverProps = {
                    gameResult: (turn === player) ? "YOU WON!" : "YOU LOST!",
                    message: "TAKES THE ROUND",
                    winner: turn,
                    clearBoxes: handlePlayAgain
                }
                :
                gameOverProps = {
                    gameResult: "IT'S A TIE!",
                    message: "NICE TRY, REMATCH ?",
                    clearBoxes: handlePlayAgain
                }
                handleGameOver(gameOverProps);
                isWin ? ((turn === player) ? updateScores("user") : updateScores("cpu")) : updateScores("tie");
            }, 500);
        }
        
        const findBlockChoice = useCallback((index)=> {
            let rowCount = 0, colCount = 0, rowCpuIndex = -1, colCpuIndex = -1;
            //Row & Column Check
            let rowIndex = Math.floor(index/3)*3, colIndex = index % 3;
            const rowEnd = rowIndex+3, colEnd = colIndex+6;
            
        while(rowIndex<rowEnd && colIndex<=colEnd) {
            inputs[rowIndex] === player ? rowCount++ : (inputs[rowIndex]===""? rowCpuIndex = rowIndex:null);
            inputs[colIndex] === player ? colCount++ : (inputs[colIndex]===""? colCpuIndex = colIndex:null);
            
            rowIndex++;
            colIndex+=3;
        }
        
        if((rowCount===2 && rowCpuIndex!==-1) && (colCount===2 && colCpuIndex!==-1)) return Math.max(rowCpuIndex, colCpuIndex);
        else if(rowCount===2 && rowCpuIndex!==-1) return rowCpuIndex;
        else if(colCount===2 && colCpuIndex!==-1) return colCpuIndex;
        
        //Diagonal Check
        if(index%2 === 0) {
            let diagonalCount = 0;
            let diagIndex = -1;
            if(index%4 === 0) for(let d=0; d<=8; d+=4) {
                inputs[d] === player ? diagonalCount++ : (inputs[d]===""? diagIndex = d:null);
            }
            
            if(diagonalCount === 2 && diagIndex!==-1) return diagIndex;
            else {
                diagonalCount = 0, diagIndex = -1;
                if(index===4 || index%4!==0) for(let d=2; d<=6; d+=2) {
                    inputs[d] === player ? diagonalCount++ : (inputs[d]===""? diagIndex = d:null);
                }
                if(diagonalCount === 2) return diagIndex;
            }
        }
        
        return -1;
        
    }, [inputs]);
    
    const findBestChoice = ()=> {
        const unMarkedIndexes = [];
        for(let i=0; i<9; i++) {
            !markedIndexes.includes(i) && unMarkedIndexes.push(i);
        }
        
        return unMarkedIndexes[Math.floor(Math.random() * unMarkedIndexes.length)];
    }
    
    const handlePlayAgain = ()=> {
        markedIndexes = [];
        ticTacRef.current.style.pointerEvents = "auto";
        setInputs(Array.from({length: 9}, (_)=> ""));
    }

    const handleRefresh = ()=> {
        let gameOverProps = {
            message: "Do you want to quit ?",
            refresh: true,
            clearBoxes: handlePlayAgain,
        }
        handleGameOver(gameOverProps);
    }

    const markInput = (index)=> {
        if(!markedIndexes.includes(index)) {
            markedIndexes.push(index);
            (turn === player)? ticTacRef.current.style.pointerEvents = "none" : null;
            setInputs((prev)=> prev.map((input, idx)=> idx===index? turn : input));
        }
    }

  return (
    <div className='play-area'>
        <section className='top-layer'>
            <div></div>
            <div className="turn" style={{borderColor: (turn ==="X")? "#31C4BE" : "#F2B237"}}>
                {turn==="X"? <span>&#215;</span> : <span style={{height: "3.8rem"}}>o</span>}&nbsp; TURN
            </div>
            <div className="refresh" onClick={handleRefresh}><img src='./images/refresh.png' alt='refresh-icon'/></div>
        </section>
        <main className="tic-tac-cards" ref={ticTacRef}>
            {inputs.map((card, index)=> (
                <div key={index} onClick={()=> markInput(index)}>
                    {card? (card==="X"? <Logo width='50' height='52'>X</Logo> : <Logo width='53' height='53'>O</Logo>) : ""}
                </div>
            ))}
        </main>
        <section className="scores">
             <div>{player} (YOU) <h3>{scores["user"]}</h3></div>
             <div>TIES <h3>{scores["tie"]}</h3></div>
             <div>{player==="X"? "O" : "X"} (CPU) <h3>{scores["cpu"]}</h3></div>
        </section>
    </div>
  )
}

export default PlayArea