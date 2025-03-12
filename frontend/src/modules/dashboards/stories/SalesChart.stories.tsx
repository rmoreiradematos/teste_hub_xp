import { Meta, StoryFn } from "@storybook/react";
import { SalesChart } from "../components/SalesChart";

const meta: Meta<typeof SalesChart> = {
  title: "Dashboard/Sales Chart",
  component: SalesChart,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn<typeof SalesChart> = (args) => <SalesChart {...args} />;

export const Default = Template.bind({});
Default.args = {
  data: [
    { date: "2024-01-01", total: 1000 },
    { date: "2024-01-02", total: 2300 },
    { date: "2024-01-03", total: 1500 },
  ],
};

export const Empty = Template.bind({});
Empty.args = {
  data: [],
};

export const HighSales = Template.bind({});
HighSales.args = {
  data: [
    { date: "2024-01-01", total: 5000 },
    { date: "2024-01-02", total: 12000 },
    { date: "2024-01-03", total: 8000 },
  ],
};

export const LowSales = Template.bind({});
LowSales.args = {
  data: [
    { date: "2024-01-01", total: 200 },
    { date: "2024-01-02", total: 150 },
    { date: "2024-01-03", total: 300 },
  ],
};

export const FluctuatingSales = Template.bind({});
FluctuatingSales.args = {
  data: [
    { date: "2024-01-01", total: 1000 },
    { date: "2024-01-02", total: 5000 },
    { date: "2024-01-03", total: 2000 },
    { date: "2024-01-04", total: 7000 },
    { date: "2024-01-05", total: 3000 },
  ],
};
