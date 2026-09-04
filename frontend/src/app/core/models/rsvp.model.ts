export interface RsvpRequest {
  fullName: string;
  attending: boolean;
  responseText?: string;
}

export interface RsvpResponse {
  success: boolean;
  detail?: string;
}
