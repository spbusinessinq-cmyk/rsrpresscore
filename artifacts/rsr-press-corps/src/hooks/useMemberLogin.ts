import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { customFetch } from "@workspace/api-client-react";

interface MemberLoginCallbacks {
  onSuccess: () => void;
  onError: (msg: string | null, isPending: boolean) => void;
}

export function useMemberLogin() {
  const [isPending, setIsPending] = useState(false);
  const { refetch } = useAuth();

  async function mutate(
    { email, password }: { email: string; password: string },
    callbacks: MemberLoginCallbacks,
  ) {
    setIsPending(true);
    try {
      await customFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await refetch();
      callbacks.onSuccess();
    } catch (err: unknown) {
      const data = (err as { data?: { error?: string } })?.data;
      const msg: string | null = data?.error ?? (err instanceof Error ? err.message : null);
      const isPendingErr = msg?.toLowerCase().includes("pending") ?? false;
      callbacks.onError(msg, isPendingErr);
    } finally {
      setIsPending(false);
    }
  }

  return { mutate, isPending };
}
