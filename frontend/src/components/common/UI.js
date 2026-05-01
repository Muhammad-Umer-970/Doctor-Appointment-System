import React from 'react';

// ── Button ────────────────────────────────────────────────────────────────────
export const Button = ({
  children, variant = 'primary', size = 'md',
  loading = false, disabled = false,
  className = '', ...props
}) => {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';
  const variants = {
    primary:  'bg-blue-600 text-white hover:bg-blue-500 shadow-blue',
    teal:     'bg-teal-600 text-white hover:bg-teal-500',
    outline:  'bg-white text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600',
    danger:   'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
    ghost:    'text-gray-500 hover:text-gray-800 hover:bg-gray-100',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  );
};

// ── Input ─────────────────────────────────────────────────────────────────────
export const Input = React.forwardRef(({
  label, error, className = '', teal = false, ...props
}, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className={`text-sm font-semibold ${teal ? 'text-teal-700' : 'text-gray-600'}`}>
        {label}
      </label>
    )}
    <input
      ref={ref}
      className={`px-3.5 py-2.5 border-[1.5px] rounded-xl text-sm text-gray-800 bg-white outline-none transition-all
        ${error ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : teal
                  ? 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}
        ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
));
Input.displayName = 'Input';

// ── Select ────────────────────────────────────────────────────────────────────
export const Select = ({ label, error, children, teal = false, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className={`text-sm font-semibold ${teal ? 'text-teal-700' : 'text-gray-600'}`}>
        {label}
      </label>
    )}
    <select
      className={`px-3.5 py-2.5 border-[1.5px] rounded-xl text-sm text-gray-800 bg-white outline-none transition-all cursor-pointer
        ${error ? 'border-red-400' : teal ? 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                                          : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}
        ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

// ── Textarea ──────────────────────────────────────────────────────────────────
export const Textarea = ({ label, error, teal = false, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className={`text-sm font-semibold ${teal ? 'text-teal-700' : 'text-gray-600'}`}>
        {label}
      </label>
    )}
    <textarea
      className={`px-3.5 py-2.5 border-[1.5px] rounded-xl text-sm text-gray-800 bg-white outline-none transition-all resize-y
        ${error ? 'border-red-400' : teal ? 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                                          : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}
        ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

// ── Badge ─────────────────────────────────────────────────────────────────────
export const Badge = ({ children, variant = 'blue', className = '' }) => {
  const variants = {
    blue:   'bg-blue-50 text-blue-700',
    teal:   'bg-teal-50 text-teal-700',
    green:  'bg-green-50 text-green-700',
    amber:  'bg-amber-50 text-amber-700',
    red:    'bg-red-50 text-red-700',
    gray:   'bg-gray-100 text-gray-600',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ── Avatar ────────────────────────────────────────────────────────────────────
export const Avatar = ({ name = '', size = 'md', color = 'blue', className = '' }) => {
  const initials = name.split(' ').filter(w => w !== 'Dr.').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-11 h-11 text-sm', lg: 'w-16 h-16 text-xl', xl: 'w-20 h-20 text-2xl' };
  const colors = { blue: 'bg-blue-600', teal: 'bg-teal-600', purple: 'bg-purple-600', amber: 'bg-amber-500' };
  return (
    <div className={`${sizes[size]} ${colors[color]} text-white rounded-full flex items-center justify-content-center font-bold flex-shrink-0 ${className}`}
      style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
      {initials}
    </div>
  );
};

// ── Card ──────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = '', hover = true, ...props }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${hover ? 'hover:shadow-lg hover:-translate-y-0.5' : ''} transition-all duration-200 ${className}`} {...props}>
    {children}
  </div>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, icon, color = 'blue' }) => {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600' },
    teal:   { bg: 'bg-teal-50',   text: 'text-teal-600' },
    green:  { bg: 'bg-green-50',  text: 'text-green-600' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    red:    { bg: 'bg-red-50',    text: 'text-red-600' },
  };
  const c = colors[color] || colors.blue;
  return (
    <Card className="p-5" hover={false}>
      <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
        <span className={`text-xl ${c.text}`}>{icon}</span>
      </div>
      <div className="text-3xl font-black text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </Card>
  );
};

// ── Loading Spinner ───────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colors = { blue: 'border-t-blue-600', teal: 'border-t-teal-600', white: 'border-t-white' };
  return (
    <div className={`${sizes[size]} border-2 border-gray-200 ${colors[color]} rounded-full animate-spin`} />
  );
};

// ── Page Loader ───────────────────────────────────────────────────────────────
export const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
);

// ── Empty State ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon = '📋', title, message, action }) => (
  <div className="text-center py-16">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
    {message && <p className="text-gray-500 text-sm mb-6">{message}</p>}
    {action}
  </div>
);

// ── Status Badge ──────────────────────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    Pending:   'amber',
    Confirmed: 'green',
    Completed: 'blue',
    Cancelled: 'red',
  };
  return <Badge variant={map[status] || 'gray'}>{status}</Badge>;
};
