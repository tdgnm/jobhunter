import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Authenticate from '../auth/Authenticate'
import logo from '../../assets/logo.svg'
import { IoMenu } from 'react-icons/io5'

const Layout = () => {
  const location = useLocation()
  const headings = {
    '/': 'Álláshirdetések',
    '/register': 'Regisztráció',
    '/login': 'Bejelentkezés',
    '/profile': 'Profil',
    '/add-job': 'Álláshirdetés hozzáadása',
    '/edit-job': 'Álláshirdetés szerkesztése',
    '/job-details': 'Álláshirdetés részletei',
  }
  const heading = headings['/' + location.pathname.split('/')[1]]

  const [open, setOpen] = useState(false)
  useEffect(() => {
    window.addEventListener('resize', showHamburger)
    setOpen(false)
    return () => window.removeEventListener('resize', showHamburger)
  }, [heading])

  const showHamburger = (e) => {
    if (e) {
      if (window.innerWidth > 1000) {
        setOpen(false)
      }
    } else {
      setOpen(!open)
    }
  }

  return (
    <>
      <header>
        <nav className="navbar bg-neutral text-white w-full">
          <div><Link to="/" className="relative jobhunter" tabIndex={-1}><img src={logo} alt="Jobhunter" className="w-10 m-2" /></Link></div>
          <ul className={`flex gap-10 w-full mx-5 justify-end nav-items ${open ? '' : 'hide-items'}`}>
            <li><NavLink to="/" className="btn btn-ghost text-base hover:bg-accent-content">Álláshirdtések</NavLink></li>
            <Authenticate type="none" noRedirect={true}>
              <span className="divider">|</span>
              <li><NavLink to="/register" className="btn btn-ghost text-base hover:bg-accent-content">Regisztráció</NavLink></li>
              <li><NavLink to="/login" className="btn btn-ghost text-base hover:bg-accent-content">Bejelentkezés</NavLink></li>
            </Authenticate>
            <Authenticate type="jobSeeker" noRedirect={true}>
              <span className="divider">|</span>
              <li><NavLink to="/profile" className="btn btn-ghost text-base hover:bg-accent-content">Profil</NavLink></li>
              <li><NavLink to="/logout" className="btn btn-ghost text-base hover:bg-accent-content">Kijelentkezés</NavLink></li>
            </Authenticate>
            <Authenticate type="company" noRedirect={true}>
              <li><NavLink to="/add-job" className="btn btn-ghost text-base hover:bg-accent-content">Álláshirdetés hozzáadása</NavLink></li>
              <span className="divider">|</span>
              <li><NavLink to="/profile" className="btn btn-ghost text-base hover:bg-accent-content">Profil</NavLink></li>
              <li><NavLink to="/logout" className="btn btn-ghost text-base hover:bg-accent-content">Kijelentkezés</NavLink></li>
            </Authenticate>
          </ul>
          <button onClick={() => showHamburger()} className="btn btn-ghost text-base hover:bg-accent-content mr-5 ml-auto hamburger"><IoMenu size={25} /></button>
        </nav>
      </header>
      <main>
        {heading && <h1 className="h-24 shadow-md text-4xl leading-tight block p-5 font-bold bg-white">{heading}</h1>}
        <Outlet />
      </main>
    </>
  )
}

export default Layout