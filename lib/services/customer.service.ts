import { customerDao } from "@/lib/dao/customer.dao";
import { HttpError } from "@/lib/http-error";
import { hashPassword, validatePasswordStrength, verifyPassword } from "@/lib/password";
import { sanitizeString, validateEmail, validatePhone, validatePostalCode } from "@/lib/validation";
import type { CustomerRow } from "@/types/db";

function toPublicCustomer(row: CustomerRow) {
  return {
    customerID: row.customerID,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    province: row.province,
    postalCode: row.postalCode,
    country: row.country,
    role: row.role,
    isDeleted: row.isDeleted,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const customerService = {
  async getById(customerID: number) {
    const row = await customerDao.findById(customerID);
    if (!row) throw new HttpError(404, "Customer not found");
    return toPublicCustomer(row);
  },

  async list(limit: number, offset: number) {
    const rows = await customerDao.list(limit, offset);
    return rows.map(toPublicCustomer);
  },

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    password: string;
    address?: string | null;
    city?: string | null;
    province?: string | null;
    postalCode?: string | null;
    country?: string | null;
    role?: string | null;
  }) {
    validateEmail(data.email);
    validatePasswordStrength(data.password);
    validatePhone(data.phone);
    validatePostalCode(data.postalCode, data.country);

    const sanitizedData = {
      firstName: sanitizeString(data.firstName, 50) || (() => { throw new HttpError(400, "First name is required"); })(),
      lastName: sanitizeString(data.lastName, 50) || (() => { throw new HttpError(400, "Last name is required"); })(),
      email: data.email.toLowerCase().trim(),
      phone: sanitizeString(data.phone, 20),
      password: await hashPassword(data.password),
      address: sanitizeString(data.address, 255),
      city: sanitizeString(data.city, 100),
      province: sanitizeString(data.province, 50),
      postalCode: sanitizeString(data.postalCode, 10),
      country: sanitizeString(data.country, 50) || "Canada",
      role: sanitizeString(data.role, 20) || "CUSTOMER",
    };

    const existing = await customerDao.findByEmail(sanitizedData.email);
    if (existing) throw new HttpError(409, "Email already registered");
    
    const id = await customerDao.insert(sanitizedData);
    const row = await customerDao.findById(id);
    if (!row) throw new HttpError(500, "Failed to load customer");
    return toPublicCustomer(row);
  },

  async authenticate(email: string, password: string) {
    validateEmail(email);
    
    const customer = await customerDao.findByEmail(email.toLowerCase().trim());
    if (!customer) throw new HttpError(401, "Invalid email or password");
    
    const isValidPassword = await verifyPassword(password, customer.password);
    if (!isValidPassword) throw new HttpError(401, "Invalid email or password");
    
    return toPublicCustomer(customer);
  },

  async update(
    customerID: number,
    data: Partial<{
      firstName: string;
      lastName: string;
      phone: string | null;
      address: string | null;
      city: string | null;
      province: string | null;
      postalCode: string | null;
      country: string | null;
      role: string | null;
      password: string;
    }>
  ) {
    const row = await customerDao.findById(customerID);
    if (!row) throw new HttpError(404, "Customer not found");

    const updateData: typeof data = {};
    
    if (data.firstName !== undefined) {
      updateData.firstName = sanitizeString(data.firstName, 50) || (() => { throw new HttpError(400, "First name cannot be empty"); })();
    }
    if (data.lastName !== undefined) {
      updateData.lastName = sanitizeString(data.lastName, 50) || (() => { throw new HttpError(400, "Last name cannot be empty"); })();
    }
    if (data.phone !== undefined) {
      validatePhone(data.phone);
      updateData.phone = sanitizeString(data.phone, 20);
    }
    if (data.address !== undefined) {
      updateData.address = sanitizeString(data.address, 255);
    }
    if (data.city !== undefined) {
      updateData.city = sanitizeString(data.city, 100);
    }
    if (data.province !== undefined) {
      updateData.province = sanitizeString(data.province, 50);
    }
    if (data.postalCode !== undefined) {
      validatePostalCode(data.postalCode, data.country || row.country);
      updateData.postalCode = sanitizeString(data.postalCode, 10);
    }
    if (data.country !== undefined) {
      updateData.country = sanitizeString(data.country, 50);
    }
    if (data.role !== undefined) {
      updateData.role = sanitizeString(data.role, 20);
    }
    if (data.password !== undefined) {
      validatePasswordStrength(data.password);
      updateData.password = await hashPassword(data.password);
    }

    await customerDao.update(customerID, updateData);
    const next = await customerDao.findById(customerID);
    if (!next) throw new HttpError(500, "Failed to load customer");
    return toPublicCustomer(next);
  },

  async softDelete(customerID: number) {
    const row = await customerDao.findById(customerID);
    if (!row) throw new HttpError(404, "Customer not found");
    await customerDao.softDelete(customerID);
  },
};
