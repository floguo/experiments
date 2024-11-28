import { useState } from 'react'
import './App.css'
import MarqueeContainer from './Marquee/MarqueeContainer'
function App() {
  const [count, setCount] = useState(0)

  return (
    <MarqueeContainer />
  )
}

export default App
