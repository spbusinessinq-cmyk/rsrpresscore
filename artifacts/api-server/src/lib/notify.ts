import { logger } from "./logger";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function notifyDiscord(message: string): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) {
    logger.info({ message }, "Discord webhook not configured, skipping notification");
    return;
  }

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });

    if (!response.ok) {
      logger.warn({ status: response.status }, "Discord webhook returned non-ok status");
    }
  } catch (err) {
    logger.error({ err }, "Failed to send Discord notification");
  }
}
