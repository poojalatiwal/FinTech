export default function Input({

  label,

  ...props
}) {

  return (

    <div className="space-y-2">

      <label
        className="
        text-sm
        text-slate-400
        "
      >
        {label}
      </label>

      <input

        {...props}

        className="
        w-full
        px-4
        py-3
        rounded-2xl
        bg-slate-900
        border
        border-slate-800
        text-white

        focus:outline-none

        focus:border-blue-500

        focus:ring-2
        focus:ring-blue-500/20

        transition-all
        "
      />

    </div>
  );
}