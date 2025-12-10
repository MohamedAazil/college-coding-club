import { Route, Routes } from "react-router-dom"
import { LoginForm } from "./components/login-form"
import { SignupForm } from "./components/signup-form"

function App() {
  return (
    <div className="w-100">
      <Routes>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/signup" element={<SignupForm/>}/>
      </Routes>
    </div>
  )
}

export default App