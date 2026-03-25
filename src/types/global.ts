export { };

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB: {
      init: (options: { appId: string; autoLogAppEvents: boolean; xfbml: boolean; version: string }) => void;
      login: (
        callback: (response: any) => void,
        options: {
          config_id: string;
          response_type: string;
          override_default_response_type: boolean;
          extras: Record<string, any>;
        }
      ) => void;
    };
  }
}
