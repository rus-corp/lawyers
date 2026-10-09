interface Props {
  // nav: red dot behind the «О»; bar: blue underline; flat: blue letter
  variant?: 'nav' | 'bar' | 'flat';
  className?: string;
}

export default function Logo({ variant = 'bar', className = '' }: Props) {
  return (
    <span className={`font-display flex items-center select-none font-black ${className}`} style={{ letterSpacing: '-0.01em' }}>
      ПРАВ
      {variant === 'flat' ? (
        <span className="text-[#1B4FD8]">О</span>
      ) : (
        <span className="relative inline-flex items-center justify-center">
          <span className={`relative z-10 ${variant === 'nav' ? 'text-white' : ''}`}>О</span>
          {variant === 'nav' ? (
            <span className="absolute inset-0 scale-[0.82] rounded-full bg-red" />
          ) : (
            <span
              className="absolute bottom-[1px] left-[1px] right-[1px] h-[2px] rounded-full"
              style={{ background: '#1B4FD8', opacity: 0.7 }}
            />
          )}
        </span>
      )}
      ДОК
    </span>
  );
}
