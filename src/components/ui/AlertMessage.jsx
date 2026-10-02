import './ui.css'

export default function AlertMessage({ title, children, tone = 'info' }) {
  return (
    <div className={`alert-message alert-message--${tone}`} role="status">
      <strong>{title}</strong>
      {children && <span>{children}</span>}
    </div>
  )
}
