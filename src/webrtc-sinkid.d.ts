export {}

declare global {
  interface HTMLMediaElement {
    /**
     * API supported by Chromium-based browsers for selecting audio output device.
     * In WebKit/WKWebView it may exist but require user gesture or be unsupported.
     */
    setSinkId?(sinkId: string): Promise<void>
    sinkId?: string
  }
}
