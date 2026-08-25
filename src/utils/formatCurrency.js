/**
 * Formats a numeric amount into Pakistani Rupee display format.
 *
 * Examples:
 *   formatCurrency(120)      → "Rs. 120"
 *   formatCurrency(1500.5)   → "Rs. 1,500.50"
 *   formatCurrency(0)        → "Rs. 0"
 *   formatCurrency(null)     → "Rs. 0"
 *
 * @param {number|string|null} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  const num = parseFloat(amount);

  if (isNaN(num)) return 'Rs. 0';

  // Use locale formatting for thousands separators
  // Whole numbers show no decimals; fractional amounts show 2
  const hasDecimals = num % 1 !== 0;

  const formatted = num.toLocaleString('en-PK', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });

  return `Rs. ${formatted}`;
}

/**
 * Formats a price range for display.
 * formatPriceRange(20, 120) → "Rs. 20 – Rs. 120"
 *
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
export function formatPriceRange(min, max) {
  return `${formatCurrency(min)} – ${formatCurrency(max)}`;
}

/**
 * Returns the raw number safely (for calculations).
 * Never use floating-point directly; always round to 2 dp.
 *
 * @param {number} amount
 * @returns {number}
 */
export function roundCurrency(amount) {
  return Math.round((parseFloat(amount) || 0) * 100) / 100;
}
