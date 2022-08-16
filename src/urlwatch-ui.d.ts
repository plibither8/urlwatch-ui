interface Config {
  urlwatch: {
    installationPath: string | null;
    jobsPath: string | null;
    configPath: string | null;
  };
}

type JobKind = "url" | "browser" | "shell";

type Objectify<T extends string, Options = unknown> =
  | T
  | { [key in T]: Options };

type JobFilter =
  | Objectify<"beautify">
  | {
      css:
        | string
        | {
            selector: string;
            skip?: number;
            maxitems?: number;
            exclude?: string;
            method?: string;
            namespaces?: Record<string, string>;
          };
    }
  | {
      csv2text: {
        format_string: string;
        ignore_header?: boolean;
        has_header?: boolean;
      };
    }
  | { "element-by-class": string }
  | { "element-by-id": string }
  | { "element-by-style": string }
  | { "element-by-tag": string }
  | Objectify<"format-json">
  | { grep: string }
  | { grepi: string }
  | Objectify<"hexdump">
  | Objectify<"html2text", "lynx" | "html2text" | "bs4" | "re" | "pyhtml2text">
  | Objectify<"pdf2text", { password?: string }>
  | Objectify<"pretty-xml">
  | Objectify<"ical2text">
  | Objectify<"ocr", { timeout?: number; language?: string }>
  | Objectify<"re.sub", { pattern: string; repl: string }>
  | Objectify<"reverse", string | { separator: string }>
  | Objectify<"sha1sum">
  | { shellpipe: string }
  | Objectify<"sort", { separator: string; reverse?: boolean }>
  | Objectify<"remove-duplicate-lines">
  | Objectify<"strip">
  | Objectify<"striplines">
  | {
      xpath:
        | string
        | { path: string; method: string; namespaces?: Record<string, string> };
    }
  | { jq: string | { query: string } };

interface JobCommonAttributes {
  name: string; // Human-readable name/label of the job
  filter?: JobFilter[]; // Filters (if any) to apply to the output (can be tested with --test-filter)
  max_tries?: number; // Number of times to retry fetching the resource
  diff_tool?: string; // Command to a custom tool for generating diff text
  diff_filter?: JobFilter[]; // Filters (if any) to apply to the diff result (can be tested with --test-diff-filter)
  treat_new_as_changed?: boolean; // Will treat jobs that don’t have any historic data as CHANGED instead of NEW (and create a diff for new jobs)
  compared_versions?: number; // Number of versions to compare for similarity
  kind?: "url" | "browser" | "shell"; // Either url, shell or browser. Automatically derived from the unique key (url, command or navigate) of the job type
  user_visible_url?: string; // Different URL to show in reports (e.g. when watched URL is a REST API URL, and you want to show a webpage)
}

interface UrlJob extends JobCommonAttributes {
  url: string;
  cookies?: Record<string, string>; // Cookies to send with the request
  method?: string; // HTTP method to use (default: GET)
  data?: string | Record<string, unknown>; // HTTP POST/PUT data
  ssl_no_verify?: boolean; // Do not verify SSL certificates (true/false)
  ignore_cached?: boolean; // Do not use cache control (ETag/Last-Modified) values (true/false)
  http_proxy?: string; // Proxy server to use for HTTP requests
  https_proxy?: string; // Proxy server to use for HTTPS requests
  headers?: Record<string, unknown>; // HTTP header to send along with the request
  encoding?: string; // Override the character encoding from the server
  timeout?: number; // Override the default socket timeout
  ignore_connection_errors?: boolean; // Ignore (temporary) connection errors
  ignore_http_error_codes?: string; // List of HTTP errors to ignore
  ignore_timeout_errors?: boolean; // Do not report errors when the timeout is hit
  ignore_too_many_redirects?: boolean; // Ignore redirect loops
  kind?: "url";
}

interface BrowserJob extends JobCommonAttributes {
  navigate: string; // URL to navigate to with the browser
  wait_until?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2"; // Either load, domcontentloaded, networkidle0, or networkidle2
  useragent?: string; // Change useragent (will be passed to pyppeteer)
  kind?: "browser";
}

interface ShellJob extends JobCommonAttributes {
  command: string; // The shell command to execute
  stderr?: "ignore" | "urlwatch" | "fail" | "stdout"; // Change how standard error is treated
  kind?: "shell";
}

type Job = UrlJob | BrowserJob | ShellJob;
