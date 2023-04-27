import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainScreen from './components/MainScreen';
import SignUp from './components/SignUp';

function App() {
  return (
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<SignUp />} />
            <Route path="/feed" element={<MainScreen />} />
          </Routes>
        </Router>
      </div>
  );
}

export default App;