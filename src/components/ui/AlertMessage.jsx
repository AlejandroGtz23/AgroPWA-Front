import './ui.css'

export default function AlertMessage({ title, children, tone = 'info', role = tone === 'danger' ? 'alert' : 'status' }) {
  return (
    <div className={`alert-message alert-message--${tone}`} role={role}>
      <strong>{title}</strong>
      {children && <span>{children}</span>}
    </div>
  )
}
