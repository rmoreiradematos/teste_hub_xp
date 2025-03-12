import HttpService from "../../../service/httpService";

const mockCategories = [
  {
    _id: "1",
    name: "Category 1",
  },
  {
    _id: "2",
    name: "Category 2",
  },
];

export interface Category {
  _id: String;
  name: string;
}

export const getCategories = async () => {
  return await HttpService.get<Category[]>("/categories");
};

export const getCategory = async (id: string) => {
  return await HttpService.get<Category>(`/categories/${id}`);
};

export const updateCategory = async (id: string, category: Category) => {
  return await HttpService.patch<Category>(`/categories/${id}`, category);
};

export const createCategory = async (category: Omit<Category, "id">) => {
  return await HttpService.post<Category>("/categories", category);
};
