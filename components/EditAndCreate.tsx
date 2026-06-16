/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Invoice, InvoiceItem } from "@/types/invoice";
import { updateInvoice, createInvoice } from "@/lib/actions";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "./Shared/Button";
import { MdDelete } from "react-icons/md";

interface FormProps {
    invoice?: Invoice;
    onClose: () => void;
    mode: "create" | "edit";
}

type Errors = Record<string, string>;

const getEmptyInvoice = (): Invoice => ({
    id: "",
    createdAt: new Date().toISOString().split("T")[0],
    paymentDue: "",
    description: "",
    paymentTerms: 30,
    clientName: "",
    clientEmail: "",
    status: "pending",
    senderAddress: { street: "", city: "", postCode: "", country: "" },
    clientAddress: { street: "", city: "", postCode: "", country: "" },
    items: [],
    total: 0,
});

const Field = ({
    label,
    errorKey,
    errors,
    children,
}: {
    label: string;
    errorKey: string;
    errors: Errors;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
            <label className={`label ${errors[errorKey] ? "text-red-500" : ""}`}>{label}</label>
            {errors[errorKey] && (
                <span className="text-red-500 text-xs italic">{errors[errorKey]}</span>
            )}
        </div>
        {children}
    </div>
);

export const InvoiceForm = ({ invoice, onClose, mode }: FormProps) => {
    // Lazy initializer to fix the "cascading render" error
    const [formData, setFormData] = useState<Invoice>(() => {
        if (invoice) return invoice;
        if (typeof window !== "undefined" && mode === "create") {
            const saved = localStorage.getItem("temp_invoice_draft");
            if (saved) return JSON.parse(saved);
        }
        return getEmptyInvoice();
    });

    const [errors, setErrors] = useState<Errors>({});

    // Keep draft in sync with localStorage
    useEffect(() => {
        if (mode === "create" && !invoice) {
            localStorage.setItem("temp_invoice_draft", JSON.stringify(formData));
        }
    }, [formData, mode, invoice]);

    const calculateGrandTotal = (items: InvoiceItem[]) =>
        items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    const handleAddItem = () => {
        const newItem: InvoiceItem = { name: "", quantity: 1, price: 0, total: 0 };
        const updatedItems = [...formData.items, newItem];
        setFormData({ ...formData, items: updatedItems, total: calculateGrandTotal(updatedItems) });
    };

    const removeItem = (index: number) => {
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: updatedItems, total: calculateGrandTotal(updatedItems) });
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
        const updatedItems = formData.items.map((item, i) => {
            if (i !== index) return item;
            // Ensure numbers are treated as numbers for calculation
            const val = (field === "quantity" || field === "price") ? Number(value) : value;
            const updatedItem = { ...item, [field]: val };
            updatedItem.total = updatedItem.quantity * updatedItem.price;
            return updatedItem;
        });
        setFormData({ ...formData, items: updatedItems, total: calculateGrandTotal(updatedItems) });
    };

    const validate = (data: Invoice): Errors => {
        const errs: Errors = {};
        if (!data.senderAddress.street.trim()) errs["senderStreet"] = "can't be empty";
        if (!data.senderAddress.city.trim()) errs["senderCity"] = "can't be empty";
        if (!data.senderAddress.postCode.trim()) errs["senderPostCode"] = "can't be empty";
        if (!data.senderAddress.country.trim()) errs["senderCountry"] = "can't be empty";
        if (!data.clientName.trim()) errs["clientName"] = "can't be empty";
        if (!data.clientEmail.trim()) errs["clientEmail"] = "can't be empty";
        if (!data.clientAddress.street.trim()) errs["clientStreet"] = "can't be empty";
        if (!data.clientAddress.city.trim()) errs["clientCity"] = "can't be empty";
        if (!data.clientAddress.postCode.trim()) errs["clientPostCode"] = "can't be empty";
        if (!data.clientAddress.country.trim()) errs["clientCountry"] = "can't be empty";
        if (!data.createdAt.trim()) errs["createdAt"] = "can't be empty";
        if (!data.description.trim()) errs["description"] = "can't be empty";
        data.items.forEach((item, i) => {
            if (!item.name.trim()) errs[`item_${i}_name`] = "can't be empty";
        });
        return errs;
    };
    const inputClass = (key: string) =>
        `input font-bold ${errors[key] ? "border-red-500 focus:border-red-500" : ""}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const errs = validate(formData);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        setErrors({});

        if (mode === "create") {
            await createInvoice({ ...formData, status: "pending" });
            localStorage.removeItem("temp_invoice_draft");
        } else {
            await updateInvoice(formData);
        }

        onClose();
    };

    const handleSaveAsDraft = async () => {
        const draftData = { ...formData, status: "draft" as const };
        if (mode === "create") {
            await createInvoice(draftData);
            localStorage.removeItem("temp_invoice_draft");
        } else {
            await updateInvoice(draftData);
        }
        onClose();
    };

  

    return (
        <div className="fixed inset-0 z-50 flex pt-16 md:pt-0">

            <div className="fixed inset-0 md:bg-black/50" onClick={onClose} />

            <div className="hidden md:block w-25.75 shrink-0" />

            <div className="relative flex flex-col w-full max-w-175 bg-white dark:bg-[#141625] h-full md:rounded-tr-[20px] md:rounded-br-[20px] shadow-2xl overflow-hidden">

                {/* SCROLL AREA */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-14 no-scrollbar">

                    {/* BACK BUTTON */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="md:hidden flex items-center gap-3 text-sm font-bold dark:text-white hover:text-[#7C5DFA] transition-colors mb-6 pt-2"
                    >
                        <FiArrowLeft className="text-[#7C5DFA] stroke-[3px]" size={18} />
                        Go Back
                    </button>

                    {/* TITLE */}
                    <h2 className="text-base sm:text-lg lg:text-2xl font-bold dark:text-white mb-8 md:mb-12 uppercase tracking-tight">
                        {mode === "create" ? (
                            "New Invoice"
                        ) : (
                            <>
                                Edit <span className="text-[#7E88C3]">#</span>{formData.id}
                            </>
                        )}
                    </h2>

                    <form id="invoice-form" onSubmit={handleSubmit}>

                        {/* BILL FROM */}
                        <section className="mb-10 md:mb-12">
                            <p className="text-[#7C5DFA] font-bold text-xs md:text-sm mb-4 md:mb-6">
                                Bill From
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

                                <div className="md:col-span-3">
                                    <Field label="Street Address" errorKey="senderStreet" errors={errors}>
                                        <input
                                            className={inputClass("senderStreet")}
                                            value={formData.senderAddress.street}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    senderAddress: {
                                                        ...formData.senderAddress,
                                                        street: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </Field>
                                </div>

                                <div>
                                    <Field label="City" errorKey="senderCity" errors={errors}>
                                        <input
                                            className={inputClass("senderCity")}
                                            value={formData.senderAddress.city}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    senderAddress: {
                                                        ...formData.senderAddress,
                                                        city: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </Field>
                                </div>

                                <div>
                                    <Field label="Post Code" errorKey="senderPostCode" errors={errors}>
                                        <input
                                            className={inputClass("senderPostCode")}
                                            value={formData.senderAddress.postCode}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    senderAddress: {
                                                        ...formData.senderAddress,
                                                        postCode: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </Field>
                                </div>

                                <div>
                                    <Field label="Country" errorKey="senderCountry" errors={errors}>
                                        <input
                                            className={inputClass("senderCountry")}
                                            value={formData.senderAddress.country}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    senderAddress: {
                                                        ...formData.senderAddress,
                                                        country: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </Field>
                                </div>
                            </div>
                        </section>

                        {/* BILL TO */}
                        <section className="mb-10 md:mb-12">
                            <p className="text-[#7C5DFA] font-bold text-xs md:text-sm mb-4 md:mb-6">
                                Bill To
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

                                <div className="md:col-span-3">
                                    <Field label="Client's Name" errorKey="clientName" errors={errors}>
                                        <input
                                            className={inputClass("clientName")}
                                            value={formData.clientName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, clientName: e.target.value })
                                            }
                                        />
                                    </Field>
                                </div>

                                <div className="md:col-span-3">
                                    <Field label="Client's Email" errorKey="clientEmail" errors={errors}>
                                        <input
                                            className={inputClass("clientEmail")}
                                            value={formData.clientEmail}
                                            onChange={(e) =>
                                                setFormData({ ...formData, clientEmail: e.target.value })
                                            }
                                        />
                                    </Field>
                                </div>

                                <div className="md:col-span-3">
                                    <Field label="Street Address" errorKey="clientStreet" errors={errors}>
                                        <input
                                            className={inputClass("clientStreet")}
                                            value={formData.clientAddress.street}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    clientAddress: {
                                                        ...formData.clientAddress,
                                                        street: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </Field>
                                </div>

                                <div>
                                    <Field label="City" errorKey="clientCity" errors={errors}>
                                        <input
                                            className={inputClass("clientCity")}
                                            value={formData.clientAddress.city}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    clientAddress: {
                                                        ...formData.clientAddress,
                                                        city: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </Field>
                                </div>

                                <div>
                                    <Field label="Post Code" errorKey="clientPostCode" errors={errors}>
                                        <input
                                            className={inputClass("clientPostCode")}
                                            value={formData.clientAddress.postCode}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    clientAddress: {
                                                        ...formData.clientAddress,
                                                        postCode: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </Field>
                                </div>

                                <div>
                                    <Field label="Country" errorKey="clientCountry" errors={errors}>
                                        <input
                                            className={inputClass("clientCountry")}
                                            value={formData.clientAddress.country}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    clientAddress: {
                                                        ...formData.clientAddress,
                                                        country: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </Field>
                                </div>
                            </div>
                        </section>

                        {/* DATE + TERMS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10 md:mb-12">

                            <Field label="Invoice Date" errorKey="createdAt" errors={errors}>
                                <input
                                    type="date"
                                    className={inputClass("createdAt")}
                                    value={formData.createdAt}
                                    onChange={(e) =>
                                        setFormData({ ...formData, createdAt: e.target.value })
                                    }
                                />
                            </Field>

                            <div>
                                <label className="label text-xs md:text-sm">Payment Terms</label>
                                <select
                                    className="input font-bold appearance-none bg-[url('/icon-arrow-down.svg')] bg-no-repeat bg-position-[right_1rem_center]"
                                    value={formData.paymentTerms}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            paymentTerms: Number(e.target.value),
                                        })
                                    }
                                >
                                    <option value={1}>Net 1 Day</option>
                                    <option value={7}>Net 7 Days</option>
                                    <option value={14}>Net 14 Days</option>
                                    <option value={30}>Net 30 Days</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <Field label="Project Description" errorKey="description" errors={errors}>
                                    <input
                                        className={inputClass("description")}
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* ITEMS */}
                        <section className="mb-24">
                            <h3 className="text-[#777F98] text-base md:text-lg font-bold mb-4">
                                Item List
                            </h3>

                            <div className="hidden md:grid grid-cols-12 gap-4 mb-2 px-2">
                                <span className="col-span-4 label">Item Name</span>
                                <span className="col-span-2 label text-center">Qty.</span>
                                <span className="col-span-3 label">Price</span>
                                <span className="col-span-2 label">Total</span>
                                <span className="col-span-1"></span>
                            </div>

                            {formData.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-4 items-center mb-4">

                                    <div className="col-span-12 md:col-span-4">
                                        <input
                                            className={inputClass(`item_${index}_name`)}
                                            value={item.name}
                                            onChange={(e) => updateItem(index, "name", e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-3 md:col-span-2">
                                        <input
                                            type="number"
                                            className="input font-bold text-center"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateItem(index, "quantity", Number(e.target.value))
                                            }
                                        />
                                    </div>

                                    <div className="col-span-4 md:col-span-3">
                                        <input
                                            type="number"
                                            className="input font-bold"
                                            value={item.price}
                                            onChange={(e) =>
                                                updateItem(index, "price", Number(e.target.value))
                                            }
                                        />
                                    </div>

                                    <div className="col-span-3 md:col-span-2 font-bold text-[#888EB0] dark:text-[#DFE3FA]">
                                        {item.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="col-span-2 md:col-span-1 flex justify-center text-[#888EB0] hover:text-red-500 transition-colors"
                                    >
                                        <MdDelete size={20} />
                                    </button>
                                </div>
                            ))}

                            <Button variant="ghost" onClick={handleAddItem} className="w-full">
                                + Add New Item
                            </Button>
                        </section>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="shrink-0 relative bg-white dark:bg-[#141625] px-4 md:px-14 py-4 md:py-6 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.3)] z-50">

                    <div className="pointer-events-none absolute -top-30 left-0 w-full h-30 bg-linear-to-t from-black/20 to-transparent dark:from-[#141625]" />

                    <div className="flex justify-end items-center gap-2 md:gap-3">

                        <Button variant="gray" onClick={onClose}>
                            {mode === "create" ? "Discard" : "Cancel"}
                        </Button>

                        <div className="flex gap-2">
                            {mode === "create" && (
                                <Button variant="dark" type="button" onClick={handleSaveAsDraft}>
                                    Save as Draft
                                </Button>
                            )}

                            <Button variant="secondary" type="submit" form="invoice-form">
                                {mode === "create" ? "Save & Send" : "Save Changes"}
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};