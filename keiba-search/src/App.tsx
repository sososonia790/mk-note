/**
 * App コンポーネント
 * 全コンポーネントの統合とレイアウト
 * Requirements: 6.1, 6.2
 */

import { Routes, Route } from 'react-router-dom';
import { Header } from './components';
import { HomePage, RaceDetailPage, SearchPage } from './pages';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/race/:id" element={<RaceDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
