export interface IdentifyRequest {
  email?: string;
  phoneNumber?: string;
}

export interface ContactRow {
  id: number;
  email: string | null;
  phoneNumber: string | null;
  linkedId: number | null;
  linkPrecedence: "primary" | "secondary";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IdentifyResponse {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}