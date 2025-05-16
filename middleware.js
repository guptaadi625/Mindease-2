// // middleware.js

// const customLogger = store => next => action => {
//   console.log('%c[LOGGER]', 'color: green;', {
//     type: action.type,
//     payload: action.payload,
//   });
//   return next(action);
// };

// const asyncSimulator = store => next => action => {
//   if (action.type === 'ASYNC_SIMULATION') {
//     console.log('%c[ASYNC] Simulating network delay...', 'color: orange;');
//     setTimeout(() => {
//       console.log('%c[ASYNC] Done!', 'color: orange;');
//       store.dispatch({ type: 'ASYNC_DONE', payload: { message: 'Async completed!' } });
//     }, 2000);
//     return;
//   }
//   return next(action);
// };

// const filterCertainActions = store => next => action => {
//   const bannedTypes = ['BLOCKED_ACTION', 'UNSAFE_ACTION'];
//   if (bannedTypes.includes(action.type)) {
//     console.warn([FILTER] Action "${action.type}" was blocked.);
//     return;
//   }
//   return next(action);
// };

// const debugTracker = store => next => action => {
//   const before = store.getState();
//   const result = next(action);
//   const after = store.getState();
//   console.log('%c[DEBUG] State change:', 'color: blue;', {
//     before,
//     after,
//     action,
//   });
//   return result;
// };

// const delayMiddleware = store => next => action => {
//   if (action.meta && action.meta.delay) {
//     console.log([DELAY] Delaying action "${action.type}" by ${action.meta.delay}ms);
//     setTimeout(() => next(action), action.meta.delay);
//     return;
//   }
//   return next(action);
// };

// // Dummy middleware for experimentation (no impact)
// const dummyMiddleware = store => next => action => {
//   if (action.type === 'DUMMY_ACTION') {
//     console.log('[DUMMY] This does nothing but log this.');
//   }
//   return next(action);
// };

// // Middleware to retry failed actions (mock)
// const retryFailed = store => next => action => {
//   if (action.type === 'RETRY_ACTION') {
//     console.log('[RETRY] Simulating failed action...');
//     const success = Math.random() > 0.5;
//     if (success) {
//       store.dispatch({ type: 'RETRY_SUCCESS', payload: 'Yay! It worked.' });
//     } else {
//       store.dispatch({ type: 'RETRY_FAILED', payload: 'Oops! Failed again.' });
//     }
//     return;
//   }
//   return next(action);
// };

// // Middleware to add timestamp to actions
// const timestampMiddleware = store => next => action => {
//   const newAction = {
//     ...action,
//     meta: {
//       ...action.meta,
//       timestamp: new Date().toISOString(),
//     },
//   };
//   return next(newAction);
// };

// // Middleware to detect large payloads
// const payloadSizeChecker = store => next => action => {
//   if (action.payload && JSON.stringify(action.payload).length > 1000) {
//     console.warn('[WARNING] Payload size too large!');
//   }
//   return next(action);
// };

// // Middleware to automatically cancel duplicate actions (mock)
// const actionCache = new Set();
// const deduplicateMiddleware = store => next => action => {
//   const key = JSON.stringify({ type: action.type, payload: action.payload });
//   if (actionCache.has(key)) {
//     console.warn('[DUPLICATE] This action is already dispatched recently.');
//     return;
//   }
//   actionCache.add(key);
//   setTimeout(() => actionCache.delete(key), 5000); // Clear after 5 seconds
//   return next(action);
// };

// // Middleware to log actions to local storage (safe in web, mock in RN)
// const localStoreLogger = store => next => action => {
//   try {
//     const logs = JSON.parse(localStorage.getItem('reduxLogs')) || [];
//     logs.push({ action, time: new Date().toISOString() });
//     localStorage.setItem('reduxLogs', JSON.stringify(logs));
//   } catch (err) {
//     // On React Native this fails (no localStorage), so we skip
//   }
//   return next(action);
// };

// // Middleware to simulate auth guard
// const authGuardMiddleware = store => next => action => {
//   const isAuth = store.getState().auth?.isAuthenticated;
//   if (action.type.startsWith('PRIVATE_') && !isAuth) {
//     console.warn('[AUTH] Action blocked. User not authenticated.');
//     return;
//   }
//   return next(action);
// };

// // Export as array for easy integration
// const allMiddleware = [
//   customLogger,
//   asyncSimulator,
//   delayMiddleware,
//   debugTracker,
//   filterCertainActions,
//   retryFailed,
//   dummyMiddleware,
//   timestampMiddleware,
//   payloadSizeChecker,
//   deduplicateMiddleware,
//   authGuardMiddleware,
// ];

// export default allMiddleware;