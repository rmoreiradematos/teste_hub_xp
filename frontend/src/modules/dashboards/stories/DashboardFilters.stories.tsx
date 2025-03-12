import { Meta, StoryFn } from "@storybook/react";
import { DashboardFilters } from "../components/DashboardFilter";

const meta: Meta<typeof DashboardFilters> = {
  title: "Dashboard/Filters",
  component: DashboardFilters,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn<typeof DashboardFilters> = (args) => (
  <DashboardFilters {...args} />
);

export const Default = Template.bind({});
Default.args = {
  filters: {
    startDate: new Date(),
    endDate: new Date(),
    categoryIds: [],
    productIds: [],
  },
  setFilters: () => {},
  categories: [
    { _id: "1", name: "Electronics" },
    { _id: "2", name: "Clothing" },
  ],
  products: [
    {
      id: "1",
      name: "Smartphone",
      description: "",
      price: 0,
      categoryIds: [],
      imageUrl: "",
    },
    {
      id: "2",
      name: "Laptop",
      description: "",
      price: 0,
      categoryIds: [],
      imageUrl: "",
    },
  ],
};

export const WithCustomCategories = Template.bind({});
WithCustomCategories.args = {
  ...Default.args,
  categories: [
    { _id: "3", name: "Furniture" },
    { _id: "4", name: "Toys" },
  ],
};

export const WithCustomProducts = Template.bind({});
WithCustomProducts.args = {
  ...Default.args,
  products: [
    {
      id: "3",
      name: "Tablet",
      description: "",
      price: 100,
      categoryIds: [],
      imageUrl: "",
    },
    {
      id: "4",
      name: "Headphones",
      description: "",
      price: 50,
      categoryIds: [],
      imageUrl: "",
    },
  ],
};
