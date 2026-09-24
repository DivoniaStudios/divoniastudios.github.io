import {
  SteamLogo,
  AppleLogo,
  GooglePlayLogo,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import type { StoreLink } from "@/data/games";

export function StoreIcon({
  kind,
  size = 18,
}: {
  kind: StoreLink["kind"];
  size?: number;
}) {
  const props = { size, weight: "fill" as const, "aria-hidden": true };
  switch (kind) {
    case "steam":
      return <SteamLogo {...props} />;
    case "appstore":
      return <AppleLogo {...props} />;
    case "googleplay":
      return <GooglePlayLogo {...props} />;
    default:
      return <ArrowUpRight size={size} weight="bold" aria-hidden />;
  }
}
