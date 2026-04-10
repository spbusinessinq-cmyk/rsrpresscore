import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      email: string;
      name: string;
      role: "operator" | "member";
      tier: string | null;
    };
  }
}
