import { BasePosAdapter } from './basePosAdapter';

export class CloverAdapter extends BasePosAdapter {
  async validateCredentials() {
    return { success: true }; // stub
  }

  async createOrder(payload: any) {
    return { success: false, error: 'clover_not_implemented_yet' };
  }

  async getMenu() {
    return { success: false, error: 'clover_menu_not_implemented_yet' };
  }
}
