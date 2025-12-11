import { Route, Routes } from "react-router-dom"
import HomeComponent from "./components/HomeComponent"
import { LoginForm } from "./components/login-form"
import { SignupForm } from "./components/signup-form"

function App() {
  return (
    <div className="flex flex-1 w-full">
      <Routes>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/signup" element={<SignupForm/>}/>
        <Route path="/" element={<HomeComponent/>}/>
      </Routes>
    </div>
  )
}

export default App