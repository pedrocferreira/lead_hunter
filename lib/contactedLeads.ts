export interface ContactedLeadInfo {
  leadId: string;
  phone?: string;
  title: string;
  contactedAt: string;
  type: "bot" | "whatsapp_direct" | "manual_copy";
  botSuccess?: boolean;
}

const STORAGE_KEY = "lead_hunter_contacted_leads_v1";

export function getContactedMap(): Record<string, ContactedLeadInfo> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function isLeadContacted(
  lead: { id?: string; phone?: string; title?: string; city?: string },
  map?: Record<string, ContactedLeadInfo>
): ContactedLeadInfo | null {
  const currentMap = map || getContactedMap();
  if (lead.id && currentMap[lead.id]) return currentMap[lead.id];
  if (lead.phone) {
    const digits = lead.phone.replace(/\D/g, "");
    if (digits && currentMap[digits]) return currentMap[digits];
    if (digits.length >= 8 && currentMap[digits.slice(-8)]) return currentMap[digits.slice(-8)];
  }
  if (lead.title && lead.city) {
    const key = `${lead.title.trim().toLowerCase()}__${lead.city.trim().toLowerCase()}`;
    if (currentMap[key]) return currentMap[key];
  }
  return null;
}

export function markLeadContacted(
  lead: { id: string; phone?: string; title: string; city?: string },
  type: "bot" | "whatsapp_direct" | "manual_copy" = "bot",
  botSuccess: boolean = true
): void {
  if (typeof window === "undefined") return;
  try {
    const map = getContactedMap();
    const info: ContactedLeadInfo = {
      leadId: lead.id,
      phone: lead.phone,
      title: lead.title,
      contactedAt: new Date().toISOString(),
      type,
      botSuccess,
    };

    map[lead.id] = info;

    if (lead.phone) {
      const digits = lead.phone.replace(/\D/g, "");
      if (digits) map[digits] = info;
    }

    if (lead.title && lead.city) {
      const key = `${lead.title.trim().toLowerCase()}__${lead.city.trim().toLowerCase()}`;
      map[key] = info;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("lead_hunter_contacted_updated"));
  } catch (err) {
    console.error("Erro ao salvar lead contatado:", err);
  }
}

export function unmarkLeadContacted(
  lead: { id: string; phone?: string; title?: string; city?: string }
): void {
  if (typeof window === "undefined") return;
  try {
    const map = getContactedMap();
    delete map[lead.id];
    if (lead.phone) {
      const digits = lead.phone.replace(/\D/g, "");
      if (digits) delete map[digits];
    }
    if (lead.title && lead.city) {
      const key = `${lead.title.trim().toLowerCase()}__${lead.city.trim().toLowerCase()}`;
      delete map[key];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new Event("lead_hunter_contacted_updated"));
  } catch (err) {
    console.error("Erro ao remover lead contatado:", err);
  }
}
