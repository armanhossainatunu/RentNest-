export interface registerPayload {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
}
