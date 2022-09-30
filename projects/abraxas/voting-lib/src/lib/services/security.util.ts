/*!
 * (c) Copyright 2022 by Abraxas Informatik AG
 * For license information see LICENSE file
 */

export class SecurityUtil {
  public static patchWindowOpen(): void {
    const originalWindowOpen = window.open;

    // Workaround for older browsers, where the Cross-Origin-Opener-Policy header isn't implemented yet
    window.open = (url = '', target = '_blank') => {
      const w = originalWindowOpen('', target) as Window;
      w.opener = null;
      w.location.href = url.toString();
      return w;
    };
  }
}
