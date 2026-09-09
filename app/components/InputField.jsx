import React from 'react';

import LoadingSpinnerSpin from './LoadingSpinnerSpin.jsx';

function InputField({
  autoComplete = true,
  borderRadius,
  errors,
  disabled,
  height,
  name,
  loading,
  minLength,
  margin,
  maxLength,
  onChange,
  onClick,
  onKeyDown,
  type,
  placeholder,
  width,
  wrapperWidth,
  value
}) {

  return (
    <div className="flex w-full flex-row items-center" style={{ width: wrapperWidth }}>
      <div className="flex w-full flex-col items-start">
        <div className="flex w-full items-center justify-start">
          <input
            autoComplete={autoComplete ? 'on' : 'off'}
            type={type ?? "text"}
            id={name ?? "username"}
            disabled={disabled}
            minLength={minLength ?? "8"}
            maxLength={maxLength ?? "36"}
            onChange={(e) => onChange(e.target.value)}
            onClick={onClick}
            onKeyDown={onKeyDown}
            placeholder={placeholder ? placeholder : name ? `Type a ${name}...` : ''}
            value={value}
            style={{ width, height, margin, borderRadius: borderRadius ?? 16, maxWidth: '400px' }}
            className={`box-border max-w-full min-w-0 flex-1 border bg-slate-50 px-3 py-3 text-sm text-slate-800 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
              errors != null
                ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
                : 'border-slate-200 focus:border-sky-400 focus:bg-white focus:ring-sky-100'
            } ${!width ? 'w-full' : ''} ${!height ? 'h-auto' : ''}`}
          />
          {loading && <div className="ml-2"><LoadingSpinnerSpin /></div>}
        </div>
        {errors != null ? (
          <div className="box-border w-full max-w-[400px] px-1 pt-1 text-xs text-red-600">
            <p>{errors}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InputField;
