import logo from './assets/logo.jpeg'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <img src={logo} alt="HomiePG" className="h-20 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-homie-blue">HomiePG</h1>
        <p className="text-homie-green mt-1">Owner Dashboard</p>
      </div>
    </div>
  )
}

export default App