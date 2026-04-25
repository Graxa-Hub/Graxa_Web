import { ThemeProvider } from './context/ThemeContext.jsx'
import Board from './components/Board.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <Board />
    </ThemeProvider>
  )
}
