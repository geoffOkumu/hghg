import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: CardProps) {
  return (
    <div className={`mb-4 pb-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardActions({
  children,
  className = "",
}: CardProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
}
