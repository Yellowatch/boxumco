import { ReactNode } from 'react';

interface WhiteCardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: WhiteCardProps) => {
  return <div className={`card ${className}`}>{children}</div>;
};

export default Card;
