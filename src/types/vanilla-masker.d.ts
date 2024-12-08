declare module 'vanilla-masker' {
  interface VMasker {
    toPattern(value: string, pattern: string): string;
  }

  const VMasker: VMasker;
  export default VMasker;
}
