import { Route, Routes } from "react-router-dom";
import AllBlogsComponent from "./components/AllBlogsComponent";
import CreateBlogComponent from "./components/CreateBlogComponent";
import HomeComponent from "./components/HomeComponent";
import { LoginForm } from "./components/login-form";
import { SignupForm } from "./components/signup-form";

function App() {
  return (
    <div className="flex flex-1 w-full">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/" element={<HomeComponent />}>
          <Route path="blogs" element={<AllBlogsComponent />} />
          <Route path="blogs/my-blogs" element={<AllBlogsComponent />} />
          <Route path="blogs/new" element={<CreateBlogComponent />} />
          {/* <Route index element={<BlogList/>}/> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
