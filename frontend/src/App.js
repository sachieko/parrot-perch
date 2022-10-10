import './App.scss';
import Room from './components/Room'
import RoomProvider from './providers/RoomProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = function () {

  return (
    <div className="parrot-perch">
      <nav className='nav'>
        <a href='/' className='nav-link'>
          <h1 id='app-header'>Parrot Perch</h1>
        </a>
      </nav>
      <RoomProvider>
        <Room />
      </RoomProvider>
    </div>

  );
}

export default App;
