import HttpService from "../../../service/httpService";
import { Category } from "../../categories/service";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryIds?: string[];
  image: File | null;
}

export interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  price: number;
  categoryIds?: Array<Partial<Category>>;
  imageUrl: string;
}

export interface ProductMapped {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  imageUrl: string;
}

export const getProducts = async () => {
  const products = await HttpService.get<ProductResponse[]>("/products");
  const mappedProducts: ProductMapped[] = products.map((product) => ({
    ...product,
    id: product._id,
    categoryIds:
      product.categoryIds
        ?.map((category) => category.name!)
        .filter((name): name is string => !!name) || [],
  }));
  return mappedProducts;
};

export const createProduct = async (product: Omit<Product, "id">) => {
  const { image, ...productData } = product;
  const imageFile =
    image instanceof File
      ? image
      : new File([image ?? ""], "filename.jpg", {
          type: "image/jpeg",
        });

  return await HttpService.postFile<Product>(
    "/products",
    productData,
    imageFile
  );
};

export const getProductById = async (id: string) => {
  const product = await HttpService.get<ProductResponse>(`/products/${id}`);
  const mappedProduct: ProductMapped = {
    ...product,
    id: product._id,
    categoryIds:
      product.categoryIds
        ?.map((category) => category.name!)
        .filter((name): name is string => !!name) || [],
  };

  return mappedProduct;
};

export const updateProduct = async (
  id: string,
  product: Omit<Product, "id | imageUrl">
) => {
  return await HttpService.patch<Product>(`/products/${id}`, product);
};

export const updateImage = async (id: string, image: File) => {
  return await HttpService.patchFile<Product>(`/products/${id}/image`, image);
};
