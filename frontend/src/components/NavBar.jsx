import parrotPerchLogo from './images/parrot-perch-logo.png';

function NavBar() {

  return (
    <nav className='nav'>  
    <a href='/' className='nav-link'>
      <div className='remove-margin'></div>
      <h1 id='app-header'>Parrot Perch</h1>
      <img className='logo-image' src={parrotPerchLogo} alt='Parrot Perch Logo' />
    </a>
  </nav>
  )
};

export default NavBar;