import { Meta, StoryFn } from "@storybook/react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProductMapped } from "../../products/services";
import { OrderEdit } from "../components/OrderEdit";

// Mocked products data
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

// Mocked order data
const order = {
  id: "123",
  date: "2024-03-12",
  products: ["1", "2"], // IDs of products that were ordered
  total: 3000,
};

const meta: Meta<typeof OrderEdit> = {
  title: "Orders/Order Edit",
  component: OrderEdit,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <Router>
        <Routes>
          {/* Definir a URL para passar o id do pedido */}
          <Route path="/orders/edit/:id" element={<Story />} />
        </Routes>
      </Router>
    ),
  ],
};

export default meta;

const Template: StoryFn<typeof OrderEdit> = (args: any) => {
  return <OrderEdit {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  products,
  order,
};

Default.parameters = {
  router: {
    path: "/orders/edit/123", // A URL agora tem o id
  },
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
  modalMessage: "Pedido atualizado com sucesso!",
  modalType: "success",
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  modalOpen: true,
  modalMessage: "Erro ao editar pedido.",
  modalType: "error",
};
