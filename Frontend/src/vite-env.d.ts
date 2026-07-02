/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_SERVICE_URL: string;
  readonly VITE_PROFILE_SERVICE_URL: string;
  readonly VITE_JOB_SERVICE_URL: string;
  readonly VITE_ASSIGNMENT_SERVICE_URL: string;
  readonly VITE_AI_MATCHING_SERVICE_URL: string;
  readonly VITE_ATTENDANCE_SERVICE_URL: string;
  readonly VITE_PAYMENT_SERVICE_URL: string;
  readonly VITE_NOTIFICATION_SERVICE_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_MAP_TILE_URL: string;
  readonly VITE_MAP_ATTRIBUTION: string;
  readonly VITE_DEFAULT_LAT: string;
  readonly VITE_DEFAULT_LNG: string;
  readonly VITE_DEFAULT_ZOOM: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
