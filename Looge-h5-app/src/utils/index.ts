import { format } from 'date-fns';

export const formatDate = (date: Date, dateFormat: string): string => {
    return format(date, dateFormat);
};

export const generateInviteCode = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let inviteCode = '';
    for (let i = 0; i < length; i++) {
        inviteCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return inviteCode;
};

export const calculateDiscount = (originalPrice: number, discountRate: number): number => {
    return originalPrice - (originalPrice * discountRate);
};

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};