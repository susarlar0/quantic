
import heroImg from "./assets/hero.png";
import dish from "./assets/dishes.png";
import award from "./assets/awards.png";

import { useState } from "react";

const images = [
  { src: heroImg, alt: "Interior Ambiance" },
  { src: dish, alt: "Signature Dish" },
  { src: award, alt: "Awards" },
];

const awards = [
  "Culinary Excellence Award – 2022",
  "Restaurant of the Year – 2023",
  "Best Fine Dining Experience – Foodie Magazine, 2023",
];

const reviews = [
  "Exceptional ambiance and unforgettable flavors. – Gourmet Review",
  "A must-visit restaurant for food enthusiasts. – The Daily Bite",
];


export default function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number|null>(null);

  return (
    <section>
      <h1>Gallery</h1>
      <div className="menu-grid">
        {images.map((img, i) => (
          <div className="card" key={i}>
            <img
              src={img.src}
              alt={img.alt}
              style={{
                cursor: "pointer",
                transition: "transform 0.3s cubic-bezier(.4,2,.3,1)",
                width: "70%",
                margin: "0 auto",
                display: "block",
                transform: "scale(0.7)"
              }}
              onClick={() => setLightboxIdx(i)}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(0.7)")}
            />
            <div style={{marginTop:".5rem",fontWeight:500}}>{img.alt}</div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div className="lightbox" onClick={() => setLightboxIdx(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={images[lightboxIdx].src} alt={images[lightboxIdx].alt} style={{maxWidth:"90vw",maxHeight:"80vh",borderRadius:"16px"}} />
            <div style={{marginTop:"1rem",fontWeight:600}}>{images[lightboxIdx].alt}</div>
            <button className="close-btn" onClick={() => setLightboxIdx(null)}>Close</button>
          </div>
        </div>
      )}

      <div className="awards-reviews" style={{marginTop:"3rem"}}>
        <h2>Awards</h2>
        <ul>
          {awards.map((a,i)=>(<li key={i}>{a}</li>))}
        </ul>
        <h2 style={{marginTop:"2rem"}}>Customer Reviews</h2>
        <ul>
          {reviews.map((r,i)=>(<li key={i} style={{fontStyle:"italic"}}>{r}</li>))}
        </ul>
      </div>
    </section>
  );
}
