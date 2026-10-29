import './ui.css'

export default function BaseField({ label, as = 'input', error, id, className = '', ...props }) {
  const Control = as
  return (
    <label className={`base-field ${className}`} htmlFor={id}>
      <span>{label}</span>
      <Control id={id} className={error ? 'is-invalid' : ''} aria-invalid={error ? true : undefined} aria-describedby={error && id ? `${id}-error` : undefined} {...props} />
      {error && <small id={id ? `${id}-error` : undefined} role="alert">{error}</small>}
    </label>
  )
}
