import "server-only";

/**
 * Structured JSON logger. On Cloud Run / App Hosting, stdout JSON lines with a
 * `severity` field are parsed natively by Cloud Logging → filterable,
 * alertable, and exportable to BigQuery via a log sink. Never log tokens,
 * cookies or raw PII.
 */
type Severity = "DEBUG" | "INFO" | "WARNING" | "ERROR";

function write(severity: Severity, message: string, fields: Record<string, unknown> = {}) {
  const entry = { severity, message, component: "aether-web", ...fields, time: new Date().toISOString() };
  const line = JSON.stringify(entry);
  if (severity === "ERROR") console.error(line);
  else console.log(line);
}

export const log = {
  debug: (m: string, f?: Record<string, unknown>) => write("DEBUG", m, f),
  info: (m: string, f?: Record<string, unknown>) => write("INFO", m, f),
  warn: (m: string, f?: Record<string, unknown>) => write("WARNING", m, f),
  error: (m: string, f?: Record<string, unknown>) => write("ERROR", m, f),
};
