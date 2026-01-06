export class StorageValidator {
  public vars: Record<string, string> = {};
  private validated = false;
  private missingVars: string[] = [];

  constructor() {
    this.checkEnv();
  }

  private checkEnv() {
    const requiredEnvVars = [
      'R2_ACCESS_KEY',
      'R2_SECRET_ACCESS_KEY',
      'R2_ENDPOINT',
      'R2_BUCKET_NAME',
    ];

    requiredEnvVars.forEach((envVar) => {
      if (!Bun.env[envVar]) {
        this.missingVars.push(envVar);
      } else {
        this.vars[envVar] = Bun.env[envVar];
      }
    });

    this.validated = this.missingVars.length === 0;
  }

  public isValid(): boolean {
    return this.validated;
  }

  public getMissingVars(): string[] {
    return this.missingVars;
  }

  public validateOrThrow(): void {
    if (!this.validated) {
      throw new Error(
        `Missing required environment variables: ${this.missingVars.join(', ')}`,
      );
    }
  }
}

export const storageValidator = new StorageValidator();
