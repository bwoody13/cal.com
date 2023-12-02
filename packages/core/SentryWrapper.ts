import * as Sentry from "@sentry/node";

// Takes in a callable function and creates a flow to wrap the function with Sentry for tracking the endpoint
const monitorCallback = async (cb: CallableFunction, ...args: any[]) => {
  // Start the Sentry performance monitoring transaction
  const transaction = Sentry.startTransaction({
    op: cb.name,
    name: `Sentry performance monitoring for ${cb.name}`,
  });

  try {
    // Await the callback if it's asynchronous
    const result = await cb(...args);
    return result;
  } catch (error) {
    // Capture exceptions in Sentry
    Sentry.captureException(error);
    throw error;
  } finally {
    // Ensure the transaction is finished
    transaction.finish();
  }
};

export default monitorCallback;
