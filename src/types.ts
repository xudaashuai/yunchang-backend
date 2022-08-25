export interface BillItem {
  type: number; // 1 代表收入，0 代表支出
  time: number; // 毫秒单位
  categoryId: string; // 外键 连接 Category
  amount: number; // 账单金额
}

export interface Category {
  type: number;
  name: string;
  id: string;
}

export interface MonthBill {
  year: number;
  month: number;
  bills: BillItem[];
}
