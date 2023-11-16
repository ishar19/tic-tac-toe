import { Quotes, Game } from './components/'
import './App.css'

function App() {

  return (
    <>
      <div id='game'>
        <Game/>
      </div>
      <div id="quote">
        <Quotes />
      </div>
    </>
  )
}

export default App
