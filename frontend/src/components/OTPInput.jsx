import { forwardRef } from 'react';

const OTPInput = forwardRef(({ 
  value, 
  onChange, 
  onKeyDown, 
  index, 
  placeholder = "0",
  className = "",
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      maxLength="1"
      className={`otp-input ${className}`}
      value={value}
      onChange={(e) => onChange(index, e.target.value)}
      onKeyDown={(e) => onKeyDown(index, e)}
      data-index={index}
      placeholder={placeholder}
      {...props}
    />
  );
});

OTPInput.displayName = 'OTPInput';

export default OTPInput;
