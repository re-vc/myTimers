export interface Timer {
    name: string;
    duration: number;
    remaining: number;
    loop: boolean;
    isActive: boolean;
  }
  