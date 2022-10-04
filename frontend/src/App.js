import './App.css';
import ConditionalRenderer from './components/ConditionalRenderer'
import Login from './components/apis/spotify/Login';
import Dashboard from './components/apis/spotify/Dashboard';

function App() {
  const code = new URLSearchParams(window.location.search).get('code');
  console.log(code);
  return (
    <div className="App">
      <h1>Hello World!</h1>
      <ConditionalRenderer /> 
      {code ? <Dashboard code={code} /> : <Login />}
    </div>
  );
}

export default App;
