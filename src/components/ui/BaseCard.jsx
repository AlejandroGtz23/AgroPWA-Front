import './ui.css'

export default function BaseCard({ children, className = '', as: Element = 'section' }) {
  return <Element className={`base-card ${className}`}>{children}</Element>
}
