import { useEffect } from 'react'
import './App.css'
import { useCountStore } from './store'

const logCounter = () => {
  const count = useCountStore.getState().count
  console.log(count)
}
// Khong nhat thiet phai su dung ben trong component
const setCounter = () => {
  const setValue = useCountStore.getState().setValue
  setValue(20)
}
function App() {
  const count = useCountStore((state) => state.count)
  useEffect(() => {
    logCounter()
  }, [count])
  return (
    <div>
      <h1>Count : {count}</h1>
      <button onClick={setCounter}>set value</button>
      <OtherComponent></OtherComponent>
    </div>
  )
}

const OtherComponent = () => {
  const count = useCountStore((state) => state.count)
  const increment = useCountStore((state) => state.increment)
  const decrement = useCountStore((state) => state.decrement)
  const setValue = useCountStore((state) => state.setValue)
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={() => setValue(10)}>Set Value</button>
    </div>
  )
}
export default App
