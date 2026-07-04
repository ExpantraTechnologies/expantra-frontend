import { supabase } from "@/lib/supabaseClient";
import { CloverAdapter } from "./cloverAdapter";
import { SquareAdapter } from "./squareAdapter";
import { ToastAdapter } from "./toastAdapter";
import {
  PosOrderResult,
  PosMenuResult,
  PosTestResult,
} from "./BasePosAdapter";

export class PosRouter {
  static async getIntegration(business_id: string) {
    const { data, error } = await supabase
      .from("pos_integrations")
      .select("*")
      .eq("business_id", business_id)
      .eq("status", "connected")
      .single();

    if (error || !data) return null;
    return data;
  }

  static getAdapter(provider: string, integration: any) {
    switch (provider) {
      case "square":
        return new SquareAdapter(integration);
      case "clover":
        return new CloverAdapter(integration);
      case "toast":
        return new ToastAdapter(integration);
      default:
        throw new Error("Unsupported POS provider");
    }
  }

  static async createOrder(
    business_id: string,
    payload: any
  ): Promise<PosOrderResult> {
    const integration = await this.getIntegration(business_id);
    if (!integration) return { success: false, error: "no_pos_configured" };

    const adapter = this.getAdapter(integration.provider, integration);
    return adapter.createOrder(payload);
  }

  static async getMenu(business_id: string): Promise<PosMenuResult | null> {
    const integration = await this.getIntegration(business_id);
    if (!integration) return null;

    const adapter = this.getAdapter(integration.provider, integration);
    return adapter.getMenu();
  }

  static async testConnection(business_id: string): Promise<PosTestResult> {
    const integration = await this.getIntegration(business_id);
    if (!integration) return { success: false, error: "no_pos_configured" };

    const adapter = this.getAdapter(integration.provider, integration);
    return adapter.validateCredentials();
  }
}
