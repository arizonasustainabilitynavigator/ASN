// Joins class names, skipping any falsy values
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Extracts a readable message from an error, with a fallback
export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const message = err?.message;
  if (typeof message === "string" && message.trim() && message.trim() !== "{}") {
    return message;
  }
  return fallback;
}
