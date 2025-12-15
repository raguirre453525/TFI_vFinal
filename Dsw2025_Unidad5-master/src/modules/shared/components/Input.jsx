function Input({ label, error = '', ...restProps }) {
  return (
    <div className='flex flex-col gap-1 w-full mb-4'>
      <label className="text-sm font-semibold text-slate-700">
        {label}:
      </label>
      <input 
        className={`
          w-full
          px-3
          py-2
          border
          rounded-md
          text-slate-900
          bg-slate-50
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-transparent
          transition
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}
        `}
        { ...restProps }
      />
      <div className="h-4">
        {error && <p className="text-red-600 text-xs font-medium">{error}</p>}
      </div>
    </div>
  );
};

export default Input;
