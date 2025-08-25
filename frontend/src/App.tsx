import { NavLink, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="app">
      <header className="container">
        <nav className="nav">
          <div className="brand">Café Fausse</div>
          <ul>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/menu">Menu</NavLink></li>
            <li><NavLink to="/reservations">Reserve</NavLink></li>
            <li><NavLink to="/gallery">Gallery</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </nav>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="container">
        © Café Fausse — Newsletter:
        <NewsletterMini />
      </footer>
    </div>
  )
}

function NewsletterMini() {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.get('email'), consent: true }),
    })
    if (res.ok) alert('Thanks for subscribing!')
    else {
      const j = await res.json().catch(() => ({}))
      alert(j.error || 'Subscription failed')
    }
    e.currentTarget.reset()
  }
  return (
    <form onSubmit={onSubmit} className="mini-form">
      <input name="email" type="email" placeholder="you@example.com" required />
      <button type="submit">Join</button>
    </form>
  )
}
