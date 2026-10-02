import './ui.css'

export default function BaseField({ label, as = 'input', error, id, className = '', ...props }) {
  const Control = as
  return (
    <label className={`base-field ${className}`} htmlFor={id}>
      <span>{label}</span>
      <Control id={id} className={error ? 'is-invalid' : ''} {...props} />
      {error && <small role="alert">{error}</small>}
    </label>
  )
}
