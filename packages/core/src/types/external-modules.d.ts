declare module 'datasets-male-first-names-en' {
  const maleNames: string[];
  export default maleNames;
}

declare module 'datasets-female-first-names-en' {
  const femaleNames: string[];
  export default femaleNames;
}

declare module 'common-last-names' {
  export const all: string[];
  export function random(): string;
}
