export class BasePosAdapter {
  integration: any;

  constructor(integration: any) {
    this.integration = integration;
  }

  async validateCredentials() {
    throw new Error('validateCredentials not implemented');
  }

  async createOrder(payload: any) {
    throw new Error('createOrder not implemented');
  }

  async createReservation(payload: any) {
    return { success: false, error: 'reservations_not_supported' };
  }

  async getMenu() {
    throw new Error('getMenu not implemented');
  }
}
