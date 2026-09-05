/**
 * Logs the raw error to the console for tracing, and returns a sanitized
 * { field: message } object safe to render to the user.
 *
 * Prefers the structured per-field errors resolvers attach via
 * `UserInputError(message, { errors })`, since the top-level GraphQL message
 * is often a generic wrapper (e.g. "Errors") rather than something a user
 * can act on. Falls back to the top-level message (already sanitized
 * server-side by formatError) if no structured errors are present.
 */
import clientConfig from '../config';

export function logAndExtractErrors(err, fallbackKey = 'general') {
  // Avoid leaking error/stack details into the browser console in production;
  // TODO: swap for a real logging service (e.g. Sentry) when one is added.
  if (clientConfig.isDevelopment) {
    console.error(err);
  }

  const graphQLError = err?.graphQLErrors?.[0];
  const structuredErrors = graphQLError?.extensions?.exception?.errors;

  if (structuredErrors && Object.keys(structuredErrors).length > 0) {
    return structuredErrors;
  }

  const message = graphQLError?.message || err?.message;
  return { [fallbackKey]: message || 'Something went wrong. Please try again.' };
}
