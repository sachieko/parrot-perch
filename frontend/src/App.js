import './App.scss';
import Room from './components/Room'
import RoomProvider from './providers/RoomProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = function() {

  return (
    <div className="parrot-perch">
      <h1>Parrot Perch</h1>
      <RoomProvider>
        <Room />
      </RoomProvider>
    </div>

  );
}

export default App;
