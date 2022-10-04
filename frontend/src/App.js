import './App.css';
import Room from './components/Room'
import RoomProvider from './providers/RoomProvider';

const App = function() {

  return (
    <div className="Parrot-perch">
      <h1>Hello World!</h1>
      <RoomProvider>
        <Room />
      </RoomProvider>
    </div>

  );
}

export default App;
