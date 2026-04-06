import { useState } from 'react'
import { login, signup } from '../utils/api'
import styles from './AuthPage.module.css'

export default function AuthPage({ onLogin }) {
  const [tab,  setTab]  = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [err,  setErr]  = useState('')

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async () => {
    setErr('')
    if (!form.email || !form.password) return setErr('Please fill in all required fields.')
    if (!/\S+@\S+\.\S+/.test(form.email))  return setErr('Please enter a valid email address.')
    
    try {
      if (tab === 'signup') {
        if (!form.name)                        return setErr('Please enter your full name.')
        if (form.password.length < 6)          return setErr('Password must be at least 6 characters.')
        if (form.password !== form.confirm)    return setErr('Passwords do not match.')
        
        const response = await signup(form.name, form.email, form.password);
        onLogin(response.data.user);
      } else {
        const response = await login(form.email, form.password);
        onLogin(response.data.user);
      }
    } catch (error) {
      console.error('Auth Error:', error);
      setErr(error.response?.data?.message || 'Authentication failed. Make sure backend is running and configured.');
    }
  }

  const switchTab = (t) => { setTab(t); setErr('') }

  return (
    <div className={styles.wrap}>
      {/* ── Left panel ── */}
      <div className={styles.left}>
        <div className={styles.leftBg} />
        <div className={styles.leftDots} />

        <div className={`${styles.brand} fi`}>
          <div className={styles.brandIcon}>◈</div>
          <span className={styles.brandName}>SmartBuy AI</span>
        </div>

        <div className={`${styles.leftContent} fu d2`}>
          <h1 className={styles.headline}>
            Stop guessing.<br />Start buying at<br />
            <em className={styles.headlineEm}>the right price.</em>
          </h1>
          <p className={styles.leftSub}>
            Paste any product link — our AI reads 12 months of price history
            and tells you exactly when to pull the trigger.
          </p>
        </div>

        <div className={`${styles.stats} fu d4`}>
          {[['94%', 'Prediction accuracy'], ['₹2.4L', 'Avg. saved / year']].map(([v, l]) => (
            <div key={l}>
              <div className={styles.statVal}>{v}</div>
              <div className={styles.statLabel}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className={styles.right}>
        <div className={styles.formWrap}>

          {/* Tabs */}
          <div className={`${styles.tabs} fi`}>
            <button
              className={`${styles.tab} ${tab === 'login'  ? styles.tabActive : ''}`}
              onClick={() => switchTab('login')}
            >
              Sign in
            </button>
            <button
              className={`${styles.tab} ${tab === 'signup' ? styles.tabActive : ''}`}
              onClick={() => switchTab('signup')}
            >
              Create account
            </button>
          </div>

          <div key={tab} className="fu">
            <h2 className={styles.formTitle}>
              {tab === 'login' ? 'Welcome back' : 'Join SmartBuy'}
            </h2>
            <p className={styles.formSub}>
              {tab === 'login'
                ? 'Enter your details to access your dashboard.'
                : 'Create your account and start saving smarter.'}
            </p>

            {err && <div className="error-msg">⚠ {err}</div>}

            {tab === 'signup' && (
              <div className={styles.field}>
                <label className={styles.label}>Full name</label>
                <input
                  className={styles.input}
                  placeholder="Arjun Sharma"
                  value={form.name}
                  onChange={set('name')}
                />
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label}>Email address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
              />
            </div>

            {tab === 'signup' ? (
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="Min. 6 chars"
                    value={form.password}
                    onChange={set('password')}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Confirm</label>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="Repeat"
                    value={form.confirm}
                    onChange={set('confirm')}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.field}>
                <label className={styles.label}>Password</label>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
              </div>
            )}

            <button className={`${styles.submitBtn} btn btn-primary`} onClick={handleSubmit}>
              {tab === 'login' ? 'Sign in →' : 'Create account →'}
            </button>

            <div className={styles.divider}>or</div>

            <button className={styles.googleBtn} onClick={handleSubmit}>
              <svg width="17" height="17" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Continue with Google
            </button>

            <p className={styles.switchText}>
              {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                className={styles.switchLink}
                onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')}
              >
                {tab === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
