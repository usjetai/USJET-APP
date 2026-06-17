/**
 * Institutional partner API surface — placeholders only.
 * Master log hold line: no live Coinbase/Robinhood handshakes until contracts close.
 */
export const partnerApiPlaceholders = {
  prewarm(): void {
    /* reserved for post-contract SDK init */
  },
  async coinbaseIntegrationStub(): Promise<{ status: "deferred" }> {
    return { status: "deferred" };
  },
  async robinhoodIntegrationStub(): Promise<{ status: "deferred" }> {
    return { status: "deferred" };
  },
};
