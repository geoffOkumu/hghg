import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
}

export function Input({
  label,
  labelClassName = "",
  error,
  className = "",
  id: providedId,
  ...props
}: InputProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium mb-1 ${labelClassName || "text-gray-700"}`}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3 py-2 border rounded shadow-sm text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          error ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
        } ${className}`}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
