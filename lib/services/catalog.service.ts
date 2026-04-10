import { categoryDao } from "@/lib/dao/category.dao";
import { productCategoryDao } from "@/lib/dao/product-category.dao";
import { productDao } from "@/lib/dao/product.dao";
import { isDuplicateEntry } from "@/lib/db-errors";
import { HttpError } from "@/lib/http-error";
import { sanitizeString, validatePrice } from "@/lib/validation";

export const catalogService = {
  async listCategories(limit: number, offset: number) {
    return categoryDao.list(limit, offset);
  },

  async getCategory(categoryID: number) {
    const row = await categoryDao.findById(categoryID);
    if (!row) throw new HttpError(404, "Category not found");
    return row;
  },

  async createCategory(data: {
    categoryName: string;
    description?: string | null;
    parentCategoryID?: number | null;
  }) {
    const sanitizedData = {
      categoryName: sanitizeString(data.categoryName, 100) || (() => { throw new HttpError(400, "Category name is required"); })(),
      description: sanitizeString(data.description),
      parentCategoryID: data.parentCategoryID,
    };

    if (sanitizedData.parentCategoryID !== null && sanitizedData.parentCategoryID !== undefined) {
      const parent = await categoryDao.findById(sanitizedData.parentCategoryID);
      if (!parent) {
        throw new HttpError(400, "Parent category not found");
      }
    }

    try {
      const id = await categoryDao.insert(sanitizedData);
      const row = await categoryDao.findById(id);
      if (!row) throw new HttpError(500, "Failed to load category");
      return row;
    } catch (e: unknown) {
      if (isDuplicateEntry(e)) {
        throw new HttpError(409, "Category name already exists");
      }
      throw e;
    }
  },

  async updateCategory(
    categoryID: number,
    data: Partial<{
      categoryName: string;
      description: string | null;
      parentCategoryID: number | null;
    }>
  ) {
    const row = await categoryDao.findById(categoryID);
    if (!row) throw new HttpError(404, "Category not found");

    const updateData: typeof data = {};
    
    if (data.categoryName !== undefined) {
      updateData.categoryName = sanitizeString(data.categoryName, 100) || (() => { throw new HttpError(400, "Category name cannot be empty"); })();
    }
    if (data.description !== undefined) {
      updateData.description = sanitizeString(data.description);
    }
    if (data.parentCategoryID !== undefined) {
      if (data.parentCategoryID !== null) {
        if (data.parentCategoryID === categoryID) {
          throw new HttpError(400, "Category cannot be its own parent");
        }
        const parent = await categoryDao.findById(data.parentCategoryID);
        if (!parent) {
          throw new HttpError(400, "Parent category not found");
        }
      }
      updateData.parentCategoryID = data.parentCategoryID;
    }

    try {
      await categoryDao.update(categoryID, updateData);
    } catch (e: unknown) {
      if (isDuplicateEntry(e)) {
        throw new HttpError(409, "Category name already exists");
      }
      throw e;
    }
    const next = await categoryDao.findById(categoryID);
    if (!next) throw new HttpError(500, "Failed to load category");
    return next;
  },

  async deleteCategory(categoryID: number) {
    const row = await categoryDao.findById(categoryID);
    if (!row) throw new HttpError(404, "Category not found");
    await categoryDao.softDelete(categoryID);
  },

  async listProducts(limit: number, offset: number, activeOnly: boolean) {
    return productDao.list(limit, offset, activeOnly);
  },

  async searchProducts(query: string, limit: number, offset: number) {
    return productDao.search(query, limit, offset);
  },

  async getProduct(productID: number) {
    const row = await productDao.findById(productID);
    if (!row) throw new HttpError(404, "Product not found");
    return row;
  },

  async createProduct(data: {
    productName: string;
    description?: string | null;
    price: string | number;
    stockQuantity?: number;
    imageURL?: string | null;
    brand?: string | null;
    model?: string | null;
    specifications?: string | null;
    isActive?: boolean;
  }) {
    const validatedPrice = validatePrice(data.price);
    
    const sanitizedData = {
      productName: sanitizeString(data.productName, 200) || (() => { throw new HttpError(400, "Product name is required"); })(),
      description: sanitizeString(data.description),
      price: validatedPrice,
      stockQuantity: data.stockQuantity !== undefined ? Math.max(0, Math.floor(data.stockQuantity)) : 0,
      imageURL: sanitizeString(data.imageURL, 255),
      brand: sanitizeString(data.brand, 100),
      model: sanitizeString(data.model, 100),
      specifications: sanitizeString(data.specifications),
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    };

    const id = await productDao.insert(sanitizedData);
    const row = await productDao.findById(id);
    if (!row) throw new HttpError(500, "Failed to load product");
    return row;
  },

  async updateProduct(
    productID: number,
    data: Partial<{
      productName: string;
      description: string | null;
      price: string | number;
      stockQuantity: number;
      version: number;
      imageURL: string | null;
      brand: string | null;
      model: string | null;
      specifications: string | null;
      isActive: boolean;
    }>
  ) {
    const row = await productDao.findById(productID);
    if (!row) throw new HttpError(404, "Product not found");

    const updateData: typeof data = {};
    
    if (data.productName !== undefined) {
      updateData.productName = sanitizeString(data.productName, 200) || (() => { throw new HttpError(400, "Product name cannot be empty"); })();
    }
    if (data.description !== undefined) {
      updateData.description = sanitizeString(data.description);
    }
    if (data.price !== undefined) {
      updateData.price = validatePrice(data.price);
    }
    if (data.stockQuantity !== undefined) {
      updateData.stockQuantity = Math.max(0, Math.floor(data.stockQuantity));
    }
    if (data.version !== undefined) {
      updateData.version = Math.max(0, Math.floor(data.version));
    }
    if (data.imageURL !== undefined) {
      updateData.imageURL = sanitizeString(data.imageURL, 255);
    }
    if (data.brand !== undefined) {
      updateData.brand = sanitizeString(data.brand, 100);
    }
    if (data.model !== undefined) {
      updateData.model = sanitizeString(data.model, 100);
    }
    if (data.specifications !== undefined) {
      updateData.specifications = sanitizeString(data.specifications);
    }
    if (data.isActive !== undefined) {
      updateData.isActive = Boolean(data.isActive);
    }

    await productDao.update(productID, updateData);
    const next = await productDao.findById(productID);
    if (!next) throw new HttpError(500, "Failed to load product");
    return next;
  },

  async deleteProduct(productID: number) {
    const row = await productDao.findById(productID);
    if (!row) throw new HttpError(404, "Product not found");
    await productDao.softDelete(productID);
  },

  async listProductCategories(productID: number) {
    const p = await productDao.findById(productID);
    if (!p) throw new HttpError(404, "Product not found");
    return productCategoryDao.listByProduct(productID);
  },

  async linkProductToCategory(productID: number, categoryID: number) {
    const p = await productDao.findById(productID);
    if (!p) throw new HttpError(404, "Product not found");
    const c = await categoryDao.findById(categoryID);
    if (!c) throw new HttpError(404, "Category not found");
    try {
      const id = await productCategoryDao.link(productID, categoryID);
      return { id, productID, categoryID };
    } catch (e: unknown) {
      if (isDuplicateEntry(e)) {
        throw new HttpError(409, "Product already linked to category");
      }
      throw e;
    }
  },

  async unlinkProductFromCategory(productID: number, categoryID: number) {
    const p = await productDao.findById(productID);
    if (!p) throw new HttpError(404, "Product not found");
    await productCategoryDao.unlink(productID, categoryID);
  },
};

