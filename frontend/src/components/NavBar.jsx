import { useContext } from 'react';
import parrotPerchLogo from './images/parrot-perch-logo.png';
import { roomContext } from '../providers/RoomProvider';

function NavBar() {
  const { isViewing } = useContext(roomContext);
  return (
    <nav className='nav' style={isViewing ? {width: '80vw'} : {width: 'inherit'}}>  
    <a href='/' className='nav-link'>
      <div></div>
      <h1 id='app-header'>Parrot Perch</h1>
      <img className='logo-image' src={parrotPerchLogo} alt='Parrot Perch Logo' />
    </a>
  </nav>
  )
};

export default NavBar;