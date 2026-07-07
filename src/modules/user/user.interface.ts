export interface registerUserPayload {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
}
