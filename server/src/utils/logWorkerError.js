const errorState = new Map();

const SUPPRESSION_WINDOW = 60_000;

const logWorkerError = (logger, workerName, error) => {
  const message = error?.message || String(error);
  const key = `${workerName}:${message}`;

  const now = Date.now();
  const state = errorState.get(key);

  if (!state || now - state.lastLogged >= SUPPRESSION_WINDOW) {
    logger.error(`${workerName} worker error`, {
      error: message,
      suppressedCount: state?.count ?? 0,
    });

    errorState.set(key, {
      lastLogged: now,
      count: 0,
    });

    return;
  }

  state.count += 1;
};

export default logWorkerError;
