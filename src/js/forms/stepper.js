/**
 * Number stepper: −/+ buttons around a native number input.
 * The buttons use aria-disabled (not `disabled`) at the limits so keyboard
 * focus never drops to the page; pressing "+" at the maximum calls `onLimit`.
 */
export function enhanceStepper(root, { onChange, onLimit } = {}) {
  const input = root.querySelector('input');
  const [decrease, increase] = root.querySelectorAll('[data-step]');
  const min = Number(input.min);
  const max = Number(input.max);

  const sync = () => {
    const value = Number(input.value);
    decrease.setAttribute('aria-disabled', String(!(value > min)));
    increase.setAttribute('aria-disabled', String(!(value < max)));
  };

  const step = (delta) => {
    const current = Number.parseInt(input.value, 10);
    const base = Number.isNaN(current) ? min : current;
    if (delta > 0 && base >= max) {
      onLimit?.();
      return;
    }
    const next = Math.min(max, Math.max(min, base + delta));
    if (next === current) return;
    input.value = String(next);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    onChange?.(next, { fromButton: true });
  };

  root.addEventListener('click', (event) => {
    const button = event.target.closest('[data-step]');
    if (button) step(Number(button.dataset.step));
  });
  input.addEventListener('input', sync);
  input.addEventListener('change', () => onChange?.(Number(input.value), { fromButton: false }));
  sync();

  return { sync };
}
