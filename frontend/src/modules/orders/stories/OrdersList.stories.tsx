import { Meta, StoryFn } from "@storybook/react";
import { BrowserRouter as Router } from "react-router-dom";
import { OrdersList } from "../components/OrdersList";

const mockOrders = [
  {
    id: "1",
    date: "2024-01-01",
    products: ["Smartphone", "Laptop"],
    total: 3000,
  },
  {
    id: "2",
    date: "2024-01-02",
    products: ["Tablet", "Headphones"],
    total: 700,
  },
  {
    id: "3",
    date: "2024-01-03",
    products: ["Smartwatch", "Laptop"],
    total: 2500,
  },
];

const meta: Meta<typeof OrdersList> = {
  title: "Orders/Orders List",
  component: OrdersList,
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

const Template: StoryFn<typeof OrdersList> = (args: any) => (
  <OrdersList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  orders: mockOrders,
};

export const Empty = Template.bind({});
Empty.args = {
  orders: [],
};

export const WithSingleOrder = Template.bind({});
WithSingleOrder.args = {
  orders: [
    {
      id: "4",
      date: "2024-02-01",
      products: ["Smartphone"],
      total: 1000,
    },
  ],
};
