// Node 18+ has global fetch. Some production runtimes still don't.
// Keep this tiny so other modules can rely on fetch existing.
import { fetch, Headers, Request, Response } from 'undici';

if (!globalThis.fetch) {
  (globalThis as unknown as { fetch: typeof fetch }).fetch = fetch;
  (globalThis as unknown as { Headers: typeof Headers }).Headers = Headers;
  (globalThis as unknown as { Request: typeof Request }).Request = Request;
  (globalThis as unknown as { Response: typeof Response }).Response = Response;
}

