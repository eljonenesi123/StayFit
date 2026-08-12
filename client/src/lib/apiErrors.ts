/** Thrown when the backend reports a route's external API key isn't configured (HTTP 501). */
export class ApiNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiNotConfiguredError";
  }
}
