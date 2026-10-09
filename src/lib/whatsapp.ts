export function formatWhatsAppPhoneNumber(
  phone: string | undefined,
): string | undefined {
  const value = phone?.trim();
  if (!value) return undefined;

  let digits = value.replace(/\D/g, "");
  if (value.startsWith("00")) {
    digits = digits.slice(2);
  } else if (!value.startsWith("+") && !digits.startsWith("880")) {
    digits = `880${digits.replace(/^0/, "")}`;
  }

  return digits.length >= 7 && digits.length <= 15 ? digits : undefined;
}
