import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavBar from "./component/MyNavBar";
import Home from "./component/Home";
import ImgPage from "./component/ImgPage";
import Categorie from "./component/Categorie";
import News from "./component/News";
import NewsPage from "./component/Newspage";

function App() {
  return (
    <Router>
      <MyNavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categorie />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsPage />} />
        <Route path="/photo/:id" element={<ImgPage />} />
      </Routes>
    </Router>
  );
}

export default App;
