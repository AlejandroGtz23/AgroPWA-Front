import './ui.css'

export default function StatusTag({ children, tone = 'success' }) {
  return <span className={`status-tag status-tag--${tone}`}>{children}</span>
}
