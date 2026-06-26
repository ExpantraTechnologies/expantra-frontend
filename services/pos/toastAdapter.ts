import { BasePosAdapter } from './basePosAdapter';

export class ToastAdapter extends BasePosAdapter {
  async validateCredentials() {
    return { success: true }; // stub
  }

  async createOrder(payload: any) {
    return { success: false, error: 'toast_not_implemented_yet' };
  }

  async getMenu() {
    return { success: false, error: 'toast_menu_not_implemented_yet' };
  }
}
