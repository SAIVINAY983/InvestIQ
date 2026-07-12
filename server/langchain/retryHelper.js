export const withRetry = async (fn, maxAttempts = 5) => {
  let attempt = 1;
  let delay = 15000;

  while (attempt <= maxAttempts) {
    try {
      return await fn();
    } catch (err) {
      const errorMessage = err.message || "";
      const isRateLimit = errorMessage.includes("429") || 
                          errorMessage.includes("Rate") || 
                          errorMessage.includes("quota") || 
                          errorMessage.includes("too quickly");

      if (attempt < maxAttempts && isRateLimit) {
        let waitTimeMs = delay;
        // Check if error message explicitly tells us how long to wait
        const waitMatch = errorMessage.match(/wait (\d+)/i) || errorMessage.match(/retry in (\d+)/i);
        if (waitMatch && waitMatch[1]) {
           waitTimeMs = (parseInt(waitMatch[1], 10) + 1) * 1000;
        }
        
        // Don't wait longer than 5 seconds to prevent freezing the UI. Let it fail and fallback.
        if (waitTimeMs > 5000) {
            console.warn(`Rate limit wait time (${waitTimeMs}ms) is too long for demo. Failing fast to trigger mock data fallback.`);
            throw err;
        }

        console.warn(`Hit rate limit. Attempt ${attempt} failed. Retrying in ${waitTimeMs / 1000} seconds...`);
        await new Promise(r => setTimeout(r, waitTimeMs));
        attempt++;
        
        if (!waitMatch) {
            delay *= 2; 
        }
      } else {
        throw err;
      }
    }
  }
};
