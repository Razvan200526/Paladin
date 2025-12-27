declare module '*.svg' {
  const path: `${string}.svg`;
  export = path;
}

declare module '*.webp' {
  const path: `${string}.webp`;
  export = path;
}

declare module '*.jpg' {
  const path: `${string}.jpg`;
  export = path;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export = classes;
}
