import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LandingPage({ setMeta }) {
  const navigate = useNavigate();
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMeta('to', to.trim());
    setMeta('from', from.trim());
    navigate('/create');
  };

  return (
    <motion.div
      className="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="landing-paper">
        <h1 className="landing-title">a memory box</h1>
        <form onSubmit={handleSubmit} className="landing-form">
          <label>
            <span className="landing-label">for</span>
            <input
              type="text"
              placeholder="recipient's name"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="landing-input"
              required
            />
          </label>
          <label>
            <span className="landing-label">from</span>
            <input
              type="text"
              placeholder="your name"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="landing-input"
              required
            />
          </label>
          <motion.button
            type="submit"
            className="landing-cta"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Box 🎀
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
