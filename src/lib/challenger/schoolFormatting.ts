export function formatSchoolName(name?: string): string | undefined {
  return name
    ?.replace(/_/g, " ")
    .replace(/\b\w/g, (char, index, str) =>
      index === 0 || str[index - 1] === " " ? char.toUpperCase() : char,
    );
}
