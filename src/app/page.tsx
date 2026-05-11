import { OrderScreen } from "@/components/order-screen";
import { TokenGate } from "@/components/token-gate";

export default function HomePage() {
  return (
    <TokenGate>
      <OrderScreen />
    </TokenGate>
  );
}
