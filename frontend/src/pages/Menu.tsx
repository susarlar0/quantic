type Item = { name:string; desc:string; price:number }
const starters: Item[] = [
  { name:"Bruschetta", desc:"Fresh tomatoes, basil, olive oil, and toasted baguette slices", price:8.50 },
  { name:"Caesar Salad", desc:"Crisp romaine with homemade Caesar dressing", price:9.00 },
]
const mains: Item[] = [
  { name:"Grilled Salmon", desc:"Served with lemon butter sauce and seasonal vegetables", price:22.00 },
  { name:"Ribeye Steak", desc:"12 oz prime cut with garlic mashed potatoes", price:28.00 },
  { name:"Vegetable Risotto", desc:"Creamy Arborio rice with wild mushrooms", price:18.00 },
]
const desserts: Item[] = [
  { name:"Tiramisu", desc:"Classic Italian dessert with mascarpone", price:7.50 },
  { name:"Cheesecake", desc:"Creamy cheesecake with berry compote", price:7.00 },
]
const beverages: Item[] = [
  { name:"Red Wine (Glass)", desc:"A selection of Italian reds", price:10.00 },
  { name:"White Wine (Glass)", desc:"Crisp and refreshing", price:9.00 },
  { name:"Craft Beer", desc:"Local artisan brews", price:6.00 },
  { name:"Espresso", desc:"Strong and aromatic", price:3.00 },
]

function Section({ title, items }:{title:string; items:Item[]}){
  return (
    <section className="section">
      <h2 style={{fontFamily:"Playfair Display,serif"}}>{title}</h2>
      <div className="menu-grid">
        {items.map(i=>(
          <article key={i.name} className="card menu-item">
            <h3 style={{marginBottom:".25rem"}}>{i.name}</h3>
            <p className="muted" style={{margin:0}}>{i.desc}</p>
            <div className="price" style={{marginTop:".5rem"}}>€{i.price.toFixed(2)}</div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function Menu(){
  return (
    <div>
      <h1 style={{fontFamily:"Playfair Display,serif"}}>Menu</h1>
      <Section title="Starters" items={starters}/>
      <Section title="Main Courses" items={mains}/>
      <Section title="Desserts" items={desserts}/>
      <Section title="Beverages" items={beverages}/>
    </div>
  )
}
