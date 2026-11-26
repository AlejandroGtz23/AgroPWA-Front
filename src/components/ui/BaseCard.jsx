import './ui.css'

export default function BaseCard({ children, className = '', as: Element = 'section', ...props }) {
  return <Element className={`base-card ${className}`} {...props}>{children}</Element>
}
