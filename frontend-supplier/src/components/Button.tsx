// This was generated using chatGPT as a template

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  ...rest
}) => {
  const baseClass = "px-4 py-2 rounded focus:outline-none transition-colors";
  const variantClass =
    variant === 'primary'
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-500 text-white hover:bg-gray-600";

  return (
    <button className={`${baseClass} ${variantClass}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
