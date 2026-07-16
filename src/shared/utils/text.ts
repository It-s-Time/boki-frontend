// RN's line breaker can split inside a single 어절 (e.g. "사기" -> "사" / "기")
// since Hangul syllables are individually breakable by default. Joining each
// word's characters with a zero-width word joiner blocks breaks there while
// leaving the real spaces between words breakable.
export function keepWordsTogether(text: string) {
  return text
    .split(' ')
    .map((word) => [...word].join('⁠'))
    .join(' ');
}
