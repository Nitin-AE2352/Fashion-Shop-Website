import React, { useState, useEffect } from 'react';

function SupportChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([
    { from: 'agent', text: 'Hi! I am your Fashion Shop support agent. Ask about orders, shipping, returns or products.' }
  ]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d) ? d : d.products || []))
      .catch(() => {});
  }, []);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { from: 'user', text: q }]);
    setInput('');
    setMessages((m) => [...m, { from: 'agent', text: '...' }]);
    try {
      const res = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen2.5:1.5b',
          stream: false,
          messages: [
            { role: 'system', content: 'You are a helpful Fashion Shop support agent. Answer concisely about orders, shipping, returns, products. Product catalog (name: price): ' + products.map((p) => `${p.name}: ₹${p.price}`).join(', ') },
            { role: 'user', content: q }
          ]
        })
      });
      const data = await res.json();
      const text = data?.message?.content || 'Sorry, no response.';
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { from: 'agent', text };
        return copy;
      });
    } catch (err) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { from: 'agent', text: 'Support unavailable. Try again later.' };
        return copy;
      });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999, background: '#FF4D6D', color: '#fff', border: 'none', borderRadius: 999, padding: '12px 18px', fontWeight: 700, boxShadow: '0 8px 24px rgba(0,0,0,.2)' }}
      >
        💬 Support
      </button>
      {open && (
        <div style={{ position: 'fixed', bottom: 80, right: 20, width: 320, maxWidth: '90vw', background: '#fff', borderRadius: 16, boxShadow: '0 12px 40px rgba(0,0,0,.2)', zIndex: 9999, display: 'flex', flexDirection: 'column', height: 400 }}>
          <div style={{ padding: 12, background: 'linear-gradient(135deg,#FF4D6D,#FF4FA3)', color: '#fff', borderRadius: '16px 16px 0 0', fontWeight: 700 }}>Fashion Shop Support</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ textAlign: m.from === 'user' ? 'right' : 'left', margin: '6px 0' }}>
                <span style={{ display: 'inline-block', padding: '8px 12px', borderRadius: 12, background: m.from === 'user' ? '#3977FF' : '#f0edef', color: m.from === 'user' ? '#fff' : '#25233A', maxWidth: '85%' }}>{m.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={send} style={{ display: 'flex', padding: 8, gap: 6, borderTop: '1px solid #eee' }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #ddd' }} />
            <button type="submit" style={{ background: '#35C98A', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 12px' }}>Send</button>
          </form>
        </div>
      )}
    </>
  );
}

export default SupportChat;