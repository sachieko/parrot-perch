import './App.scss';
import Room from './components/Room'
import RoomProvider from './providers/RoomProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';

const App = function () {

  return (
    <div className="parrot-perch">
      <RoomProvider>
        <NavBar />
        <Room />
      </RoomProvider>
    </div>

  );
};

export default App;
