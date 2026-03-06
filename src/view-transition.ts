export function inViewTransition(fn: () => void) {
  if (document.startViewTransition) {
    document.startViewTransition(() => fn());
  } else {
    fn();
  }
}
