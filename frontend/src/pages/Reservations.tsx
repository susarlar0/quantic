import { z } from "zod"
import { useState } from "react"

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),                 // ← optional now
  party_size: z.coerce.number().int().min(1).max(12),
  date: z.string().min(1),
  time: z.string().min(1),
  special_requests: z.string().optional(),
})

export default function Reservations(){
  const [loading,setLoading]=useState(false)
  const [date, setDate] = useState("");
  // Helper to get day of week from date string
  function getDayOfWeek(dateStr:string){
    if(!dateStr) return null;
    const d = new Date(dateStr);
    return d.getDay(); // 0=Sunday, 1=Monday, ...
  }

  // Generate time slots for given day
  function getTimeSlots(day:number){
    let start = 17, end = (day === 0 ? 21 : 23); // Sunday: 5pm-9pm, else 5pm-11pm
    const slots = [];
    for(let h=start; h<=end; h++){
      for(let m=0; m<60; m+=30){
        if(h===end && m>0) break;
        let hour = h.toString().padStart(2,"0");
        let min = m.toString().padStart(2,"0");
        slots.push(`${hour}:${min}`);
      }
    }
    return slots;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries())
    const parsed = Schema.safeParse(raw)
    if(!parsed.success){ alert("Please check your inputs."); return }
    setLoading(true)
    try{
      const res = await fetch("/api/reservations",{
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(parsed.data)
      })
      const j = await res.json().catch(()=>({}))
      if(res.ok) alert(`Reservation confirmed! Table ${j.table_number} (ID ${j.id})`)
      else alert(j.error || "Error")
      if(res.ok) e.currentTarget.reset()
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="form">
      <h1>Reserve a Table</h1>
      <div className="grid">
        <label>Name<input name="name" required /></label>
        <label>Email<input name="email" type="email" required /></label>
        <label>Phone (optional)<input name="phone" /></label> {/* no required */}
        <label>Party Size<input name="party_size" type="number" min={1} max={12} required /></label>
        <label>Date
          <input
            name="date"
            type="date"
            required
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>
        <label>Time
          <select name="time" required disabled={!date}>
            <option value="">Select time</option>
            {getTimeSlots(getDayOfWeek(date)).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label>Special Requests<textarea name="special_requests" /></label>
      <button type="submit" disabled={loading}>{loading ? "Booking…" : "Book now"}</button>
      <p className="muted" style={{marginTop:".5rem"}}>
        Reservations accepted in 30-minute slots during business hours.
      </p>
    </form>
  )
}
