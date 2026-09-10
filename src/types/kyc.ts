export type DocumentType = "Int'l Passport" | "National ID" | "Drivers License";

export interface KycFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  dob: string;
  social_media: string;
  address: string;
  city: string;
  state: string;
  country: string;
  document_type: DocumentType;
  frontimg: File | null;
  backimg: File | null;
  agree: boolean;
}