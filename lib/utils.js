export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const message = err?.message;
  if (typeof message === "string" && message.trim() && message.trim() !== "{}") {
    return message;
  }
  return fallback;
}
