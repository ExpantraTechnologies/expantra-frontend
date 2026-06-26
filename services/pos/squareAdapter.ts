import { BasePosAdapter } from './basePosAdapter';

export class SquareAdapter extends BasePosAdapter {
  async validateCredentials() {
    return { success: true }; // stub
  }

  async createOrder(payload: any) {
    return { success: false, error: 'square_not_implemented_yet' };
  }

  async getMenu() {
    return { success: false, error: 'square_menu_not_implemented_yet' };
  }
}
