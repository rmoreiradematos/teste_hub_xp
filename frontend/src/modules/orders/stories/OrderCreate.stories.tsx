import { Meta, StoryFn } from "@storybook/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ProductMapped } from "../../products/services";
import { OrderCreate } from "../components/OrderCreate";

const products: ProductMapped[] = [
  {
    id: "1",
    name: "Smartphone",
    description: "",
    price: 1000,
    categoryIds: [],
    imageUrl: "",
  },
  {
    id: "2",
    name: "Laptop",
    description: "",
    price: 2000,
    categoryIds: [],
    imageUrl: "",
  },
  {
    id: "3",
    name: "Tablet",
    description: "",
    price: 500,
    categoryIds: [],
    imageUrl: "",
  },
];

const meta: Meta<typeof OrderCreate> = {
  title: "Orders/Order Create",
  component: OrderCreate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Router>
        <Story />
      </Router>
    ),
  ],
};

export default meta;

const Template: StoryFn<typeof OrderCreate> = (args: any) => (
  <OrderCreate {...args} />
);

export const Default = Template.bind({});
Default.args = {
  products,
};

export const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  isSubmitting: true,
};

export const Success = Template.bind({});
Success.args = {
  ...Default.args,
  modalOpen: true,
  modalMessage: "Pedido criado com sucesso!",
  modalType: "success",
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  modalOpen: true,
  modalMessage: "Erro ao criar pedido.",
  modalType: "error",
};
