import {
  BasePosAdapter,
  PosOrderResult,
  PosMenuResult,
  PosTestResult,
} from "./BasePosAdapter";

export class SquareAdapter extends BasePosAdapter {
  async validateCredentials(): Promise<PosTestResult> {
    return { success: true };
  }

  async createOrder(payload: any): Promise<PosOrderResult> {
    return { success: false, error: "square_not_implemented_yet" };
  }

  async getMenu(): Promise<PosMenuResult> {
    return { success: false, error: "square_menu_not_implemented_yet" };
  }
}
