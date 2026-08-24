// ============================================================
// Tipos do Banco de Dados — Lead Hunter Pro SaaS
// ============================================================

import { Lead } from "../types";

export type ClientStatus = "active" | "inactive" | "maintenance";
export type SiteType = "site" | "card";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user";
  plan: "starter" | "pro" | "agency";
  createdAt: string;
}

export interface ClientRecord {
  id: string;
  userId: string;
  companyName: string;
  clientName?: string;
  slug: string;
  category: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  logoUrl?: string;
  brandColors?: {
    primary?: string;
    secondary?: string;
    logoDominant?: string;
    photoDominant?: string;
  };
  instagramHandle?: string;
  facebookHandle?: string;
  originalWebsite?: string;
  rating: number;
  reviewsCount: number;
  services?: string[];
  photos?: string[];
  openingHours?: Record<string, string>;
  notes?: string;
  status: ClientStatus;
  monthlyFee?: number; // Valor da mensalidade em R$
  dueDay?: number; // Dia do vencimento
  createdAt: string;
  updatedAt: string;
}

export interface HostedSiteRecord {
  id: string;
  userId: string;
  clientId: string;
  type: SiteType;
  slug: string;
  title: string;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  status: ClientStatus;
  viewsCount: number;
  clicksCount: number;
  customDomain?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  clients: ClientRecord[];
  hostedSites: HostedSiteRecord[];
  userLeads: { id: string; userId: string; lead: Lead; createdAt: string }[];
}
