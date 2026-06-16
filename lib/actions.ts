 
import { Invoice } from "@/types/invoice";
import initialData from "@/data.json";

const STORAGE_KEY = "invoices_data";

// Helper to generate IDs like 'RT3080'
const generateId = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let id = "";
    for (let i = 0; i < 2; i++) id += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 4; i++) id += numbers.charAt(Math.floor(Math.random() * numbers.length));
    return id;
};

export const getInvoices = (): Invoice[] => {
    if (typeof window === "undefined") return [];
    
    const data = localStorage.getItem(STORAGE_KEY);
    
    if (!data) {
        // If storage is empty, seed it with data.json and return it
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        return initialData as Invoice[];
    }
    
    return JSON.parse(data);
};

export const getInvoiceById = (id: string): Invoice | undefined => {
    const invoices = getInvoices();
    return invoices.find((inv) => inv.id === id);
};

export const createInvoice = async (newInvoice: Invoice) => {
    const invoices = getInvoices();
    
    const itemsWithTotals = newInvoice.items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
    }));

    const grandTotal = itemsWithTotals.reduce((sum, item) => sum + item.total, 0);
    
    const createdDate = new Date(newInvoice.createdAt);
    const dueDate = new Date(createdDate);
    dueDate.setDate(createdDate.getDate() + newInvoice.paymentTerms);

    const finalInvoice: Invoice = {
        ...newInvoice,
        id: generateId(),
        items: itemsWithTotals,
        total: grandTotal,
        paymentDue: dueDate.toISOString().split("T")[0],
    };

    const updatedInvoices = [finalInvoice, ...invoices];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInvoices));
    
    return { success: true };
};

export const updateInvoice = async (updatedInvoice: Invoice) => {
    const invoices = getInvoices();

    const itemsWithTotals = updatedInvoice.items.map((item) => ({
        ...item,
        total: item.quantity * item.price,
    }));

    const finalInvoice = {
        ...updatedInvoice,
        items: itemsWithTotals,
        total: itemsWithTotals.reduce((sum, item) => sum + item.total, 0),
    };

    const newInvoices = invoices.map((inv) =>
        inv.id === updatedInvoice.id ? finalInvoice : inv
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newInvoices));
    return { success: true };
};

export const markAsPaid = async (id: string) => {
    const invoices = getInvoices();
    const updated = invoices.map((inv) =>
        inv.id === id ? { ...inv, status: "paid" as const } : inv
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true };
};

export const deleteInvoice = async (id: string) => {
    const invoices = getInvoices();
    const filtered = invoices.filter((inv) => inv.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { success: true };
};