export const getElement = <R extends HTMLElement>(id: string): R | null => {
  const element = document.getElementById(id);
  return element as R | null;
};

export const showToastError = (message: string) => {
  const toast = document.createElement("div");
  toast.className = "toast toast-top toast-center z-[100000]";
  toast.innerHTML = `
    <div class="alert alert-error text-error-content shadow-lg max-w-sm">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span class="text-sm">${message}</span>
    </div>
  `;

  // Native <dialog> elements exist in the browser's "Top Layer" which ignores standard z-index.
  // Inject the toast directly into the open dialog if one exists so it renders above the modal.
  const openDialog = document.querySelector("dialog[open]");
  if (openDialog) {
    openDialog.appendChild(toast);
  } else {
    document.body.appendChild(toast);
  }

  setTimeout(() => {
    toast.classList.add("opacity-0", "transition-opacity", "duration-500");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
};
