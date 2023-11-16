import React, {useRef} from 'react'
import toast, {Toaster} from 'react-hot-toast';
import {Logo} from './'
import './css/Home.scss';

function Home({
    player,
    changePlayer,
    gameStarts,
}) {

    const inviteRef = useRef(null);
    const notify = () => {
        toast.success("Invite link copied", {
            position: 'top-right',
            iconTheme: {
                primary: "#F2B237",
                secondary: "#192A32"
            },
            style: {
                borderRadius: "0.3125rem",
                backgroundColor: "#192A32",
                color: "#F2B237",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: "800"
            }
        })
    };

    const handleInvite = ()=> {
        inviteRef.current.disabled = true;
        window.navigator.clipboard.writeText(window.location.href);
        notify();
        setTimeout(()=> inviteRef.current.disabled = false, 2000);
    }

  return (
    <div className='home'>
        <div className='pick'>
            <h3>PICK PLAYER</h3>
              <div className="player-options">
                  <div
                      className={player === "X" ? "selected" : ""}
                      onClick={() => changePlayer("X")}
                  >
                      <Logo color={player === "X" ? "#192A32" : "#D9D9D9"}>X</Logo>
                  </div>
                  <div
                      className={player === "O" ? "selected" : ""}
                      onClick={() => changePlayer("O")}
                  >
                      <Logo color={player === "O" ? "#192A32" : "#D9D9D9"}>O</Logo>
                  </div>
              </div>
        </div>
        <div className="new-game">
            <button onClick={gameStarts}>NEW GAME ( VS CPU )</button>
            <button>NEW GAME ( VS HUMAN ) Coming soon</button>
        </div>
        <div className='invite'>
            <button onClick={handleInvite} ref={inviteRef}>Invite your friend</button>
        </div>
        <Toaster/>
    </div>
  )
} 

export default Home