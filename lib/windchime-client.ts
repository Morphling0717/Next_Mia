import { createWindChimeClient, createWindChimeLiveClient } from "@windchime/embed/client";

const sessionFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (response.status === 401 && typeof window !== "undefined") window.dispatchEvent(new Event("mail:unauthorized"));
  return response;
};

export const mailClient = createWindChimeClient({ baseUrl: "/api/mail", fetch: sessionFetch });
export const mailLiveClient = createWindChimeLiveClient({ fetch: sessionFetch });
