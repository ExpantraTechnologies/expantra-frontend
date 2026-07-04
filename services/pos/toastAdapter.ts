import {
  BasePosAdapter,
  PosOrderResult,
  PosMenuResult,
  PosTestResult,
} from "./BasePosAdapter";

export class ToastAdapter extends BasePosAdapter {
  async validateCredentials(): Promise<PosTestResult> {
    return { success: true };
  }

  async createOrder(payload: any): Promise<PosOrderResult> {
    return { success: false, error: "toast_not_implemented_yet" };
  }

  async getMenu(): Promise<PosMenuResult> {
    return { success: false, error: "toast_menu_not_implemented_yet" };
  }
}
