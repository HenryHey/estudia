import ca from "@/messages/ca.json";

export const locales = ["ca"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ca";

const catalogs = { ca } satisfies Record<Locale, typeof ca>;

type Catalog = (typeof catalogs)[Locale];

type Paths<T> = T extends string
  ? never
  : {
      [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`;
    }[keyof T & string];

export type MessageKey = Paths<Catalog>;

function lookup(catalog: Catalog, key: MessageKey): string {
  const value = key.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in node) {
      return (node as Record<string, unknown>)[part];
    }
    return undefined;
  }, catalog);

  if (typeof value !== "string") {
    throw new Error(`Missing message: ${key}`);
  }

  return value;
}

export function t(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string | number>,
): string {
  const template = lookup(catalogs[locale], key);
  if (!vars) return template;

  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
