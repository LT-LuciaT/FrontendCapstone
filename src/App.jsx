import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyNavBar from "./component/MyNavBar";
import Home from "./component/Home";
import ImgPage from "./component/ImgPage";
import Categorie from "./component/Categorie";
import News from "./component/News";
import NewsPage from "./component/Newspage";
import MyMood from "./component/MyMood";
import BoardDetail from "./component/BoardDetail";
import MoodboardPage from "./component/MoodboardPage";

function App() {
  return (
    <Router>
      <MyNavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categorie />} />
        <Route path="/mymoods" element={<MyMood />} />
        <Route path="/mymoods/board/:id" element={<BoardDetail />} />
        <Route path="/mymoods/:id/moodboard" element={<MoodboardPage />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsPage />} />
        <Route path="/photo/:id" element={<ImgPage />} />
      </Routes>
    </Router>
  );
}

export default App;
