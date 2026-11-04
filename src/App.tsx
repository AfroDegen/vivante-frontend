import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Menu,
  Package,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { useState } from 'react'

const collections = [
  {
    number: '01',
    name: 'Period Care',
    description: 'Thoughtful essentials for every cycle.',
    price: 'From ₦15,000',
  },
  {
    number: '02',
    name: 'Gift Boxes',
    description: 'Beautifully curated gifts for someone special.',
    price: 'From ₦25,000',
  },
  {
    number: '03',
    name: 'Self-Care',
    description: 'Little reminders to put yourself first.',
    price: 'From ₦18,000',
  },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <main>
      <div className="announcement">
        A little more care, delivered to your door.
      </div>

      <header className="navbar">
        <a className="wordmark" href="#" aria-label="Vivante home">
          vivante<span>.</span>
        </a>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a href="#collections" onClick={closeMenu}>Collections</a>
          <a href="#story" onClick={closeMenu}>Our Story</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>

        <a className="nav-cta" href="#collections">
          Explore <ArrowUpRight size={15} />
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={14} /> CARE, CONSIDERED
          </span>

          <h1>
            Make room
            <br />
            for <em>yourself.</em>
          </h1>

          <p>
            Thoughtful period care and beautifully curated gifts.
            Because feeling cared for should never be an afterthought.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#collections">
              Discover the collection <ArrowRight size={17} />
            </a>
            <a className="text-link" href="#story">Get to know us</a>
          </div>

          <div className="hero-note">
            <Heart size={15} />
            Made with care. Delivered with love.
          </div>
        </div>

        <div className="hero-art">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="hero-sun" />
          <div className="gift-box">
            <div className="gift-lid">
              <div className="gift-bow" />
            </div>
            <div className="gift-body">
              <span>vivante</span>
            </div>
            <div className="gift-ribbon" />
          </div>
          <div className="floating-card">
            <Heart size={16} fill="currentColor" />
            <span>A gift of care</span>
          </div>
          <span className="art-caption">A little joy, beautifully wrapped.</span>
        </div>
      </section>

      <section className="trust-strip">
        <div><Heart size={18} /> Thoughtfully curated</div>
        <div><Package size={18} /> Beautifully packaged</div>
        <div><ShieldCheck size={18} /> Care in every detail</div>
      </section>

      <section className="collections section" id="collections">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE VIVANTE EDIT</span>
            <h2>Care in every <em>form.</em></h2>
          </div>
          <p>Find something that feels just right.</p>
        </div>

        <div className="collection-grid">
          {collections.map((item) => (
            <article className="collection-card" key={item.number}>
              <div className={`collection-art art-${item.number}`}>
                <span>{item.number}</span>
                <div className="mini-gift">
                  <div className="mini-bow" />
                  <div className="mini-box" />
                </div>
              </div>
              <div className="collection-info">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <span className="price">{item.price}</span>
                </div>
                <a href="#contact" aria-label={`Enquire about ${item.name}`}>
                  <ArrowUpRight size={20} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story section" id="story">
        <div className="story-art">
          <div className="story-circle">
            <Heart size={42} strokeWidth={1} />
            <span>with love</span>
          </div>
        </div>
        <div className="story-copy">
          <span className="eyebrow">A NOTE FROM VIVANTE</span>
          <h2>Because care is not a <em>luxury.</em></h2>
          <p>
            We believe the little things matter. A package that arrives
            at the right moment. Essentials chosen with intention.
            A gift that says, “I thought of you.”
          </p>
          <p>
            Vivante is here to make everyday care feel a little more
            special — one thoughtful box at a time.
          </p>
          <a className="text-link" href="#contact">
            Say hello <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="custom-cta" id="contact">
        <span className="eyebrow">SOMETHING PERSONAL</span>
        <h2>A little care goes a <em>long way.</em></h2>
        <p>
          Have a special request or want to create a gift of your own?
          We'd love to hear from you.
        </p>
        <a
          className="primary-button light-button"
          href="https://wa.me/"
          target="_blank"
          rel="noreferrer"
        >
          Let's create something <ArrowUpRight size={17} />
        </a>
      </section>

      <footer className="footer">
        <a className="wordmark" href="#">vivante<span>.</span></a>
        <p>Thoughtful care, always.</p>
        <span>© {new Date().getFullYear()} Vivante Lagos</span>
      </footer>
    </main>
  )
}

export default App
