/**
 * This is adapted from https://github.com/mdn/serviceworker-cookbook
 */

export async function registerWebPush(
  apiRequest: (path: string, options?: RequestInit) => Promise<Response>,
) {
  const registration = await navigator.serviceWorker.ready;

  // Use the PushManager to get the user's subscription to the push service.
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const response = await apiRequest('push/vapid-public-key');
    const vapidPublicKey = await response.text();

    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
  }

  return apiRequest('push/register', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      subscription,
    }),
  });
}

// Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
