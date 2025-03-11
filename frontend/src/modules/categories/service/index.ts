const mockCategories = [
  {
    id: 1,
    name: "Category 1",
  },
  {
    id: 2,
    name: "Category 2",
  },
];

export interface Category {
  id: number;
  name: string;
}

export const getCategories = async () => {
  return mockCategories;
};

export const getCategory = async (id: string) => {
  return mockCategories.find((category) => category.id === Number(id));
};

export const updateCategory = async (category: Category) => {
  return category;
};

export const createCategory = async (category: Omit<Category, "id">) => {
  const newCategory = { ...category, id: mockCategories.length + 1 };
  mockCategories.push(newCategory);
  return newCategory;
};
