export default function Button({

  children,

  onClick,

  type = "button",

  className = ""
}) {

  return (

    <button

      type={type}

      onClick={onClick}

      className={`
      w-full
      py-3
      rounded-2xl
      bg-gradient-to-r
      from-blue-600
      to-indigo-600
      hover:from-blue-500
      hover:to-indigo-500
      font-semibold
      transition-all
      duration-300
      shadow-lg
      hover:shadow-blue-500/30
      ${className}
      `}
    >

      {children}

    </button>
  );
}