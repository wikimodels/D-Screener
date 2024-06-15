// deno-lint-ignore-file no-explicit-any
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 15,
  delay: number = 100
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (!isLockedError(error)) {
        throw error;
      }
      console.log(
        `%cKV operation failed (attempt ${attempt}/${maxRetries})`,
        "color:cyan"
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }

  throw new Error(`KV operation failed after ${maxRetries} retries`);
}

function isLockedError(error: any) {
  const isLocked = error.message.includes("database is locked") ? true : false;
  return isLocked;
}
