import { Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Home } from './pages/Home'
import { NewDesign } from './pages/NewDesign'
import { DesignResultPage } from './pages/DesignResultPage'
import { History } from './pages/History'

function App() {
  return (
    <div className="flex h-screen bg-charcoal-950 text-white overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NewDesign />} />
            <Route path="/design/result" element={<DesignResultPage />} />
            <Route path="/design/:id" element={<DesignResultPage />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
