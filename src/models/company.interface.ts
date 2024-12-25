export interface Company {
    id: number;
    name: string;
    logo: string;
    description: string;
    website: string;
    thumbnail: string;
    amount_of_employee: number;
    tax_number: string;
    status: string;
    address: string;
    phone: string;
    email: string;
    contract: File | string;
    created_at: string;
    updated_at: string;
}