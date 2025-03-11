const mockProducts = [
  {
    id: "1",
    name: "Produto Mock",
    description: "Descrição mockada",
    price: 99.9,
    categoryIds: ["1", "2"],
    imageUrl:
      "https://s2-techtudo.glbimg.com/L9wb1xt7tjjL-Ocvos-Ju0tVmfc=/0x0:1200x800/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2023/q/l/TIdfl2SA6J16XZAy56Mw/canvaai.png",
  },
];

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryIds?: string[];
  image: File | null;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryIds?: string[];
  imageUrl: string;
}

export const getProducts = async () => mockProducts;
export const createProduct = async (product: Omit<Product, "id">) => {
  const newProduct = { ...product, id: Date.now().toString() };
  return newProduct;
};

export const getProductById = async (id: string) => {
  return mockProducts[0];
};

export const updateProduct = async (
  id: string,
  product: Omit<Product, "id | imageUrl">
) => {
  return product;
};

export const updateImage = async (id: string, image: File) => {
  return image;
};
