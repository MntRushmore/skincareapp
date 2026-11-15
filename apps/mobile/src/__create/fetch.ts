import * as SecureStore from 'expo-secure-store';
import { fetch as expoFetch } from 'expo/fetch';
import { getApiUrl } from '../utils/api-url';

const originalFetch = fetch;
const authKey = 'skin-analysis-jwt';

const getURLFromArgs = (...args: Parameters<typeof fetch>) => {
  const [urlArg] = args;
  let url: string | null;
  if (typeof urlArg === 'string') {
    url = urlArg;
  } else if (typeof urlArg === 'object' && urlArg !== null) {
    url = urlArg.url;
  } else {
    url = null;
  }
  return url;
};

const isFileURL = (url: string) => {
  return url.startsWith('file://') || url.startsWith('data:');
};

const isRelativeURL = (url: string) => url.startsWith('/');

type Params = Parameters<typeof expoFetch>;
const fetchToWeb = async function fetchWithHeaders(...args: Params) {
  const [input, init] = args;
  const url = getURLFromArgs(input, init);
  if (!url) {
    return expoFetch(input, init);
  }

  if (isFileURL(url)) {
    return originalFetch(input, init);
  }

  if (!isRelativeURL(url) && !url.startsWith(getApiUrl())) {
    return expoFetch(input, init);
  }

  const apiURL = getApiUrl();
  if (isRelativeURL(url) && !apiURL) {
    throw new Error(
      'EXPO_PUBLIC_API_URL is not set. Point it at the backend, for example http://localhost:4000',
    );
  }

  let finalInput = input;
  if (typeof input === 'string') {
    finalInput = input.startsWith('/') ? `${apiURL}${input}` : input;
  } else {
    return expoFetch(input, init);
  }

  const initHeaders = init?.headers ?? {};
  const finalHeaders = new Headers(initHeaders);

  const auth = await SecureStore.getItemAsync(authKey)
    .then((stored) => {
      return stored ? JSON.parse(stored) : null;
    })
    .catch(() => {
      return null;
    });

  if (auth?.jwt) {
    finalHeaders.set('authorization', `Bearer ${auth.jwt}`);
  }

  return expoFetch(finalInput, {
    ...init,
    headers: finalHeaders,
  });
};

export default fetchToWeb;
