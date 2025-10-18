import * as React from 'react';

import { cn } from '@/lib/utils';

type NumberInputProps = React.ComponentProps<'input'> & {
  allowDecimal?: boolean;
};

function NumberInput({ className, allowDecimal = true, onKeyDown, onPaste, ...props }: NumberInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
    if (allowed.includes(e.key)) return;
    const isModifier = e.ctrlKey || e.metaKey;
    if (isModifier && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x')) return;
    const char = e.key;
    if (char.length === 1) {
      if (/^[0-9]$/.test(char)) return;
      if (allowDecimal && char === '.') return;
      e.preventDefault();
    }
    if (onKeyDown) onKeyDown(e as unknown as React.KeyboardEvent<HTMLInputElement>);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    const regex = allowDecimal ? /^[0-9]*\.?[0-9]*$/ : /^[0-9]*$/;
    if (!regex.test(text)) {
      e.preventDefault();
      return;
    }
    if (onPaste) onPaste(e as unknown as React.ClipboardEvent<HTMLInputElement>);
  };

  return (
    <input
      {...props}
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
    pattern={allowDecimal ? '[0-9]*\\.?[0-9]*' : '[0-9]*'}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
    />
  );
}

export { NumberInput };
