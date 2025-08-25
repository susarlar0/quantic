import { Link } from "react-router-dom"
import heroImg from "./assets/hero.png"

export default function Home(){
  return (
    <section className="section">
      <div className="hero">
        <div>
          <h1>Café Fausse</h1>
            <p className="lede">
            A modern bistro with Italian soul.
            </p>
            <p className="muted" style={{ margin: 0 }}>
            Address: 1234 Culinary Ave, Suite 100, Washington, DC 20002
            </p>
            <p className="muted" style={{ margin: 0 }}>
            Phone Number: (202) 555-4567
            </p>
          <div style={{ display:"flex", gap:"0.6rem", marginTop:"1rem" }}>
            <Link to="/reservations" className="cta">Reserve a table</Link>
            <Link to="/menu" className="cta ghost">View menu</Link>
          </div>

          {/* Hours block */}
          <div style={{marginTop:"1.25rem"}}>
            <h3 style={{margin:"0 0 .25rem"}}>Hours</h3>
            <p className="muted" style={{margin:0}}>
              Monday–Saturday: 5:00 PM – 11:00 PM<br/>
              Sunday: 5:00 PM – 9:00 PM
            </p>
          </div>
        </div>

        <div className="card" style={{ padding:0 }}>
          <img
            src={heroImg}
            alt="Café Fausse Hero"
            style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"12px" }}
          />
        </div>
      </div>
    </section>
  )
}
