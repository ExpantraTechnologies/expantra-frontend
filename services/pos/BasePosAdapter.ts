export interface PosOrderResult {
  success: boolean;
  pos_order_id?: string;
  error?: string;
}

export interface PosMenuResult {
  success: boolean;
  items?: any[];
  error?: string;
}

export interface PosTestResult {
  success: boolean;
  error?: string;
}

export class BasePosAdapter {
  integration: any;

  constructor(integration: any) {
    this.integration = integration;
  }

  async validateCredentials(): Promise<PosTestResult> {
    throw new Error("validateCredentials not implemented");
  }

  async createOrder(payload: any): Promise<PosOrderResult> {
    throw new Error("createOrder not implemented");
  }

  async createReservation(payload: any): Promise<PosOrderResult> {
    return { success: false, error: "reservations_not_supported" };
  }

  async getMenu(): Promise<PosMenuResult> {
    throw new Error("getMenu not implemented");
  }
}
