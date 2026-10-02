import './ui.css'

export default function BaseButton({ children, variant = 'primary', type = 'button', className = '', ...props }) {
  return (
    <button type={type} className={`base-button base-button--${variant} ${className}`} {...props}>
      {children}
    </button>
  )
}
