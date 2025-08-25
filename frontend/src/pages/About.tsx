export default function About(){
  return (
    <section className="section">
      <h1 style={{fontFamily:"Playfair Display,serif"}}>About Café Fausse</h1>
      <p>
        Founded in 2010 by Chef <strong>Antonio Rossi</strong> and restaurateur <strong>Maria Lopez</strong>,
        Café Fausse blends traditional Italian flavors with modern culinary innovation. Our mission
        is to provide an unforgettable dining experience that reflects both quality and creativity.
      </p>

      <div className="cards" style={{marginTop:"1rem"}}>
        <article className="card">
          <h3>Chef Antonio Rossi</h3>
          <p className="muted">
            Trained in Emilia-Romagna, Antonio champions seasonal produce, handmade pastas, and
            respectful technique. His menus balance comfort with surprise.
          </p>
        </article>
        <article className="card">
          <h3>Maria Lopez</h3>
          <p className="muted">
            A lifelong host and wine devotee, Maria curates a warm room and a cellar focused on
            small Italian producers and local artisans.
          </p>
        </article>
        <article className="card">
          <h3>Our Commitment</h3>
          <p className="muted">
            Unforgettable dining through excellent food, thoughtful service, and locally sourced
            ingredients from regional farms and fisheries.
          </p>
        </article>
      </div>
    </section>
  )
}
