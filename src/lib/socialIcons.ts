import {
  Globe,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

const socialIconMap: Record<string, LucideIcon> = {
  facebook: Globe,
  instagram: Globe,
  linkedin: Globe,
  whatsapp: MessageCircle,
  telegram: MessageCircle,
  twitter: Globe,
  youtube: Globe,
};

export function getSocialIcon(network: string): LucideIcon {
  const normalized = network.toLowerCase().replace(/[^a-z]/g, "");
  return socialIconMap[normalized] ?? Globe;
}
