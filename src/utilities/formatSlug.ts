const turkishCharMap: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
}

/**
 * Bir metni URL'de kullanılabilir hale getirir.
 * Örnek: "Kaygı Bozukluğu Nedir?" -> "kaygi-bozuklugu-nedir"
 */
export const formatSlug = (value: string): string =>
  value
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]/g, (char) => turkishCharMap[char] ?? char)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
