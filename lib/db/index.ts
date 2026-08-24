// ============================================================
// Database Engine — Persistência ACID Transacional em Arquivo
// Armazena usuários, clientes, leads e sites hospedados
// ============================================================

import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import {
  DatabaseSchema,
  UserRecord,
  ClientRecord,
  HostedSiteRecord,
  ClientStatus,
} from "./types";
import { Lead } from "../types";
import { buildStaticSite } from "../export/staticSite";
import { buildLinkCardHtml } from "../export/linkCardExport";
import { buildDesignKit } from "../design/kit";
import { kitInputFromLead } from "../design/seed";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "app_database.json");

function ensureDbDirectory() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

// In-memory cache do schema
let _memoryDb: DatabaseSchema | null = null;

const initialSchema: DatabaseSchema = {
  users: [],
  clients: [],
  hostedSites: [],
  userLeads: [],
};

function readDb(): DatabaseSchema {
  ensureDbDirectory();

  if (!fs.existsSync(DB_FILE)) {
    // Seed inicial com usuário admin
    const adminPasswordHash = bcrypt.hashSync("admin123", 10);
    const defaultAdmin: UserRecord = {
      id: "usr_admin_default",
      name: "Administrador",
      email: "admin@leadhunter.pro",
      passwordHash: adminPasswordHash,
      role: "admin",
      plan: "agency",
      createdAt: new Date().toISOString(),
    };

    const initial: DatabaseSchema = {
      ...initialSchema,
      users: [defaultAdmin],
    };

    writeDb(initial);
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (!parsed.users) parsed.users = [];
    if (!parsed.clients) parsed.clients = [];
    if (!parsed.hostedSites) parsed.hostedSites = [];
    if (!parsed.userLeads) parsed.userLeads = [];
    return parsed;
  } catch (err) {
    console.error("Erro ao ler app_database.json:", err);
    return initialSchema;
  }
}

function writeDb(data: DatabaseSchema): void {
  ensureDbDirectory();
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error("Erro ao gravar banco de dados:", err);
  }
}

// ─── Helpers de Slug ─────────────────────────────────────────────────────────
export function createSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── USUÁRIOS ────────────────────────────────────────────────────────────────

export function findUserByEmail(email: string): UserRecord | null {
  const db = readDb();
  const normalized = email.trim().toLowerCase();
  return db.users.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function findUserById(id: string): UserRecord | null {
  const db = readDb();
  return db.users.find((u) => u.id === id) || null;
}

export function createUser(userData: {
  name: string;
  email: string;
  password: string;
  plan?: "starter" | "pro" | "agency";
}): UserRecord {
  const db = readDb();
  const existing = findUserByEmail(userData.email);
  if (existing) {
    throw new Error("Este email já está cadastrado.");
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(userData.password, salt);

  const newUser: UserRecord = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    passwordHash,
    role: db.users.length === 0 ? "admin" : "user",
    plan: userData.plan || "pro",
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDb(db);
  return newUser;
}

// ─── CLIENTES ────────────────────────────────────────────────────────────────

export function getClientsByUserId(userId: string): ClientRecord[] {
  const db = readDb();
  return db.clients
    .filter((c) => c.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getClientById(id: string, userId?: string): ClientRecord | null {
  const db = readDb();
  const client = db.clients.find((c) => c.id === id);
  if (!client) return null;
  if (userId && client.userId !== userId) return null;
  return client;
}

export function getClientBySlug(slug: string): ClientRecord | null {
  const db = readDb();
  return db.clients.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export function createClient(
  userId: string,
  clientData: Omit<ClientRecord, "id" | "userId" | "createdAt" | "updatedAt">
): { client: ClientRecord; site: HostedSiteRecord; card: HostedSiteRecord } {
  const db = readDb();

  let baseSlug = clientData.slug || createSlug(clientData.companyName);
  let finalSlug = baseSlug;
  let counter = 1;
  while (db.clients.some((c) => c.slug === finalSlug)) {
    finalSlug = `${baseSlug}-${counter++}`;
  }

  const now = new Date().toISOString();
  const clientId = `cli_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newClient: ClientRecord = {
    ...clientData,
    id: clientId,
    userId,
    slug: finalSlug,
    status: clientData.status || "active",
    createdAt: now,
    updatedAt: now,
  };

  db.clients.push(newClient);

  // Gera automaticamente o Site e o Cartão de Visita a partir dos dados do cliente
  const pseudoLead: Lead = clientRecordToLead(newClient);
  const staticSite = buildStaticSite(pseudoLead);
  const kit = buildDesignKit(kitInputFromLead(pseudoLead));
  const cardHtml = buildLinkCardHtml(pseudoLead, kit);

  const siteId = `site_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const cardId = `card_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const htmlContent = staticSite.files.find((f) => f.name === "index.html")?.content || "";
  const cssContent = staticSite.files.find((f) => f.name === "styles.css")?.content || "";
  const jsContent = staticSite.files.find((f) => f.name === "script.js")?.content || "";

  const hostedSite: HostedSiteRecord = {
    id: siteId,
    userId,
    clientId,
    type: "site",
    slug: finalSlug,
    title: newClient.companyName,
    htmlContent,
    cssContent,
    jsContent,
    status: newClient.status,
    viewsCount: 0,
    clicksCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const hostedCard: HostedSiteRecord = {
    id: cardId,
    userId,
    clientId,
    type: "card",
    slug: finalSlug,
    title: `Cartão de Visita — ${newClient.companyName}`,
    htmlContent: cardHtml,
    cssContent: "",
    jsContent: "",
    status: newClient.status,
    viewsCount: 0,
    clicksCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  db.hostedSites.push(hostedSite, hostedCard);
  writeDb(db);

  return { client: newClient, site: hostedSite, card: hostedCard };
}

export function updateClient(
  id: string,
  userId: string,
  updates: Partial<Omit<ClientRecord, "id" | "userId" | "createdAt">>
): ClientRecord | null {
  const db = readDb();
  const index = db.clients.findIndex((c) => c.id === id && c.userId === userId);
  if (index === -1) return null;

  const current = db.clients[index];

  // Se o slug mudou, sincroniza também os sites hospedados
  const oldSlug = current.slug;
  const newSlug = updates.slug ? createSlug(updates.slug) : current.slug;

  const updated: ClientRecord = {
    ...current,
    ...updates,
    slug: newSlug,
    updatedAt: new Date().toISOString(),
  };

  db.clients[index] = updated;

  // Atualiza os sites vinculados (slug e status)
  db.hostedSites.forEach((site) => {
    if (site.clientId === id) {
      site.slug = newSlug;
      if (updates.status) {
        site.status = updates.status;
      }
      site.updatedAt = updated.updatedAt;
    }
  });

  writeDb(db);
  return updated;
}

export function deleteClient(id: string, userId: string): boolean {
  const db = readDb();
  const initialLength = db.clients.length;
  db.clients = db.clients.filter((c) => !(c.id === id && c.userId === userId));

  if (db.clients.length === initialLength) return false;

  // Remove também os sites hospedados vinculados
  db.hostedSites = db.hostedSites.filter((s) => s.clientId !== id);
  writeDb(db);
  return true;
}

// ─── SITES HOSPEDADOS ────────────────────────────────────────────────────────

export function getHostedSitesByUserId(userId: string): HostedSiteRecord[] {
  const db = readDb();
  return db.hostedSites
    .filter((s) => s.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getHostedSitesByClientId(clientId: string): HostedSiteRecord[] {
  const db = readDb();
  return db.hostedSites.filter((s) => s.clientId === clientId);
}

export function getHostedSiteById(id: string, userId?: string): HostedSiteRecord | null {
  const db = readDb();
  const site = db.hostedSites.find((s) => s.id === id);
  if (!site) return null;
  if (userId && site.userId !== userId) return null;
  return site;
}

export function getHostedSiteBySlugAndType(
  slug: string,
  type: "site" | "card"
): HostedSiteRecord | null {
  const db = readDb();
  const clean = slug.toLowerCase().trim();
  return db.hostedSites.find((s) => s.slug.toLowerCase() === clean && s.type === type) || null;
}

export function updateHostedSiteCode(
  id: string,
  userId: string,
  updates: {
    htmlContent?: string;
    cssContent?: string;
    jsContent?: string;
    slug?: string;
    status?: ClientStatus;
    customDomain?: string;
  }
): HostedSiteRecord | null {
  const db = readDb();
  const site = db.hostedSites.find((s) => s.id === id && s.userId === userId);
  if (!site) return null;

  if (updates.htmlContent !== undefined) site.htmlContent = updates.htmlContent;
  if (updates.cssContent !== undefined) site.cssContent = updates.cssContent;
  if (updates.jsContent !== undefined) site.jsContent = updates.jsContent;
  if (updates.slug !== undefined) site.slug = createSlug(updates.slug);
  if (updates.status !== undefined) site.status = updates.status;
  if (updates.customDomain !== undefined) site.customDomain = updates.customDomain;
  site.updatedAt = new Date().toISOString();

  writeDb(db);
  return site;
}

export function incrementSiteView(id: string): void {
  const db = readDb();
  const site = db.hostedSites.find((s) => s.id === id);
  if (site) {
    site.viewsCount = (site.viewsCount || 0) + 1;
    writeDb(db);
  }
}

export function incrementSiteClick(id: string): void {
  const db = readDb();
  const site = db.hostedSites.find((s) => s.id === id);
  if (site) {
    site.clicksCount = (site.clicksCount || 0) + 1;
    writeDb(db);
  }
}

// ─── CONVERSÃO DE LEAD PARA CLIENTE ──────────────────────────────────────────

export function convertLeadToClient(
  userId: string,
  lead: Lead,
  customOptions?: { monthlyFee?: number; notes?: string }
): { client: ClientRecord; site: HostedSiteRecord; card: HostedSiteRecord } {
  const companyName = lead.title || "Empresa sem Nome";
  const slug = createSlug(companyName);

  const clientData: Omit<ClientRecord, "id" | "userId" | "createdAt" | "updatedAt"> = {
    companyName,
    clientName: "",
    slug,
    category: lead.category || "Geral",
    phone: lead.phone || "",
    whatsapp: lead.whatsappNumber || lead.phone || "",
    address: lead.address || "",
    city: lead.city || "",
    logoUrl: lead.logoUrl || "",
    brandColors: lead.brandColors,
    instagramHandle: lead.instagramHandle,
    facebookHandle: lead.facebookHandle,
    originalWebsite: lead.originalWebsite,
    rating: lead.rating || 5.0,
    reviewsCount: lead.reviewsCount || 1,
    openingHours: lead.openingHours,
    photos: lead.photos || [],
    services: [],
    status: "active",
    monthlyFee: customOptions?.monthlyFee || 99,
    dueDay: 10,
    notes: customOptions?.notes || "Convertido diretamente do Lead Hunter",
  };

  return createClient(userId, clientData);
}

// ─── UTILITÁRIOS INTERNOS ────────────────────────────────────────────────────

function clientRecordToLead(c: ClientRecord): Lead {
  return {
    id: c.id,
    title: c.companyName,
    phone: c.phone,
    whatsappNumber: c.whatsapp,
    address: c.address,
    city: c.city,
    category: c.category,
    rating: c.rating || 5.0,
    reviewsCount: c.reviewsCount || 1,
    analyzedStatus: "NO_SITE",
    analyzedAt: new Date().toISOString(),
    logoUrl: c.logoUrl,
    brandColors: c.brandColors,
    instagramHandle: c.instagramHandle,
    facebookHandle: c.facebookHandle,
    originalWebsite: c.originalWebsite,
    openingHours: c.openingHours,
    photos: c.photos,
  };
}
