// Reusable helper functions
import { TIMEOUT_SECONDS } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // prettier-ignore
    const resp = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    const data = await resp.json();

    if (!resp.ok) throw new Error(`${data.message} (${resp.status})`);
    // console.log(resp, data);
    return data; // gives back a resolved promise
  } catch (err) {
    throw err;
  }
};

// sending data with post fetch
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    // prettier-ignore
    const resp = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);
    const data = await resp.json();

    if (!resp.ok) throw new Error(`${data.message} (${resp.status})`);
    // console.log(resp, data);
    return data;
  } catch (err) {
    throw err;
  }
};
