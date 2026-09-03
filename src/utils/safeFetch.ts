/**
 * Safe Fetch & API Utility with robust logging and non-JSON error interception.
 * 
 * Prevents "Unexpected token '<' / 'T'" JSON parsing crashes by safely reading
 * the raw response text first, logging the actual response for debugging,
 * and ensuring actionable errors when a server or hosting provider (like Vercel)
 * returns an HTML error page or non-JSON response.
 */

export interface SafeFetchResponse<T = any> {
  ok: boolean;
  status: number;
  statusText: string;
  data: T | null;
  rawText: string;
  error?: string;
  isJson: boolean;
  contentType: string;
}

export class ApiError extends Error {
  status: number;
  statusText: string;
  rawText: string;
  url: string;
  isHtml: boolean;

  constructor(message: string, status: number, statusText: string, rawText: string, url: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.rawText = rawText;
    this.url = url;
    this.isHtml = rawText.trim().startsWith('<') || rawText.toLowerCase().includes('<!doctype');
  }
}

/**
 * Executes a fetch request, safely logs the raw text response before parsing,
 * handles transient dev-server boot / HTML loading pages with automated backoff retry,
 * and prevents JSON parse syntax errors.
 */
export async function safeFetch<T = any>(
  url: string,
  options: RequestInit = {},
  retries: number = 2
): Promise<SafeFetchResponse<T>> {
  const method = options.method || 'GET';
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json, text/plain, */*');
  }

  const debugPrefix = `[SafeFetch ${method} ${url}]`;
  console.log(`${debugPrefix} Initiating request...`);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers
    });
  } catch (networkErr: any) {
    if (retries > 0) {
      console.warn(`${debugPrefix} Transient network issue, retrying in 800ms (${retries} attempts left)...`);
      await new Promise((r) => setTimeout(r, 800));
      return safeFetch<T>(url, options, retries - 1);
    }
    const message = networkErr?.message || 'Network connection failed';
    console.error(`${debugPrefix} Network failure:`, networkErr);
    throw new ApiError(
      `Network error communicating with ${url}: ${message}`,
      0,
      'NetworkError',
      '',
      url
    );
  }

  const contentType = response.headers.get('content-type') || '';
  
  // 1. SAFELY READ RAW TEXT FIRST
  let rawText = '';
  try {
    rawText = await response.text();
  } catch (readErr: any) {
    console.error(`${debugPrefix} Failed to read response stream:`, readErr);
    throw new ApiError(
      `Could not read response text from ${url}`,
      response.status,
      response.statusText,
      '',
      url
    );
  }

  // 2. LOG THE RAW TEXT RESPONSE FOR DEBUGGING
  console.log(
    `${debugPrefix} Status: ${response.status} ${response.statusText} | Content-Type: "${contentType}" | Length: ${rawText.length} bytes`
  );

  // 3. CHECK IF CONTENT IS TRANSIENT HTML / DEV SERVER STARTUP PAGE
  const isHtml = rawText.trim().startsWith('<') || 
                 rawText.toLowerCase().includes('<!doctype') || 
                 rawText.toLowerCase().includes('<html') ||
                 rawText.startsWith('The page cannot') ||
                 rawText.startsWith('The page c');

  // If server was starting up and returned "Starting Server..." HTML page, auto-retry once
  if (isHtml && rawText.includes('Starting Server...') && retries > 0) {
    console.log(`${debugPrefix} Dev server starting up. Retrying request in 1000ms...`);
    await new Promise((r) => setTimeout(r, 1000));
    return safeFetch<T>(url, options, retries - 1);
  }

  // 4. ATTEMPT SAFE JSON PARSING
  let parsedData: T | null = null;
  let isJson = false;

  if (rawText.trim().length > 0) {
    try {
      parsedData = JSON.parse(rawText) as T;
      isJson = true;
    } catch {
      isJson = false;
    }
  }

  // 5. EVALUATE SUCCESS AND HANDLE NON-JSON / HTML RESPONSES
  if (!response.ok || !isJson) {
    let errorMessage = '';

    if (!isJson) {
      if (isHtml) {
        // Extract basic title or text snippet from HTML for cleaner error messages
        const titleMatch = rawText.match(/<title>(.*?)<\/title>/i);
        const titleText = titleMatch ? titleMatch[1] : '';
        const bodySnippet = rawText.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
        
        errorMessage = `Server returned an HTML response (Status ${response.status} ${response.statusText})${
          titleText ? ` - "${titleText}"` : ''
        }: ${bodySnippet || 'Check server logs.'}`;
      } else {
        errorMessage = `Server returned non-JSON response (Status ${response.status}): ${rawText.slice(0, 150)}`;
      }
      
      console.error(
        `${debugPrefix} Expected JSON but received ${isHtml ? 'HTML Response' : 'Plaintext'}.`,
        { status: response.status, url, preview: rawText.slice(0, 300) }
      );
    } else if (parsedData && typeof parsedData === 'object' && 'error' in (parsedData as any)) {
      errorMessage = (parsedData as any).error;
    } else {
      errorMessage = `API request failed with status ${response.status} ${response.statusText}`;
    }

    return {
      ok: false,
      status: response.status,
      statusText: response.statusText,
      data: parsedData,
      rawText,
      error: errorMessage,
      isJson,
      contentType
    };
  }

  return {
    ok: true,
    status: response.status,
    statusText: response.statusText,
    data: parsedData,
    rawText,
    isJson: true,
    contentType
  };
}

/**
 * Convenient wrapper that returns parsed JSON data or throws a descriptive ApiError with rawText attached.
 */
export async function safeFetchJson<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const result = await safeFetch<T>(url, options);
  
  if (!result.ok || !result.data) {
    throw new ApiError(
      result.error || `Request failed with status ${result.status}`,
      result.status,
      result.statusText,
      result.rawText,
      url
    );
  }

  return result.data;
}
