/* eslint-disable @typescript-eslint/no-explicit-any */

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const uuid = (): string => crypto.randomUUID();

export const fetchWithExponentialBackoff = async (
  apiUrl: string,
  payload: any,
  retries: number = 5,
  delayMs: number = 1000
): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 429 && i < retries - 1) {
        await delay(delayMs);
        delayMs *= 2;
        continue;
      }

      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(
          `API Error: ${res.status} - ${
            errBody.error?.message || res.statusText
          }`
        );
      }

      return res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await delay(delayMs);
      delayMs *= 2;
    }
  }
};
