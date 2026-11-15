import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-sm outline-none transition placeholder:text-white/40 focus:border-white/20',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
