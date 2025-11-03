import { useReducer } from 'react';
import './App.css'
import NaviPanel from './components/NaviPanel/NaviPanel'
import Space from './components/Space/Space'

function App() {


  return (
    <div className="app">
      <Space createdCards={[]}></Space>
      <NaviPanel crearedSpaces={[]}></NaviPanel>
    </div>
  )
}

export default App
