/**
 * "Copy" button for a branch's national short address (the code people paste
 * into delivery and ride apps). Stays hidden where the Clipboard API is missing.
 */
export default function locationCopy(button) {
  if (!navigator.clipboard?.writeText) return;

  const text = button.querySelector('.branch__copy-text');
  const idle = text.textContent;
  let timer;

  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
    } catch {
      return;
    }
    text.textContent = button.dataset.done;
    button.dataset.state = 'done';
    clearTimeout(timer);
    timer = setTimeout(() => {
      text.textContent = idle;
      delete button.dataset.state;
    }, 2000);
  });
}
