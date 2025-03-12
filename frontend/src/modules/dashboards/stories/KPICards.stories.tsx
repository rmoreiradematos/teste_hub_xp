import { Meta, StoryFn } from "@storybook/react";
import { KPICards } from "../components/KPICards";

const meta: Meta<typeof KPICards> = {
  title: "Dashboard/KPI Cards",
  component: KPICards,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

const Template: StoryFn<typeof KPICards> = (args) => <KPICards {...args} />;

export const Default = Template.bind({});
Default.args = {
  metrics: {
    totalOrders: 150,
    totalRevenue: 25000,
    averageOrderValue: 166.67,
  },
};

export const Empty = Template.bind({});
Empty.args = {
  metrics: {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  },
};

export const HighRevenue = Template.bind({});
HighRevenue.args = {
  metrics: {
    totalOrders: 1000,
    totalRevenue: 1000000,
    averageOrderValue: 1000,
  },
};

export const LowRevenue = Template.bind({});
LowRevenue.args = {
  metrics: {
    totalOrders: 50,
    totalRevenue: 5000,
    averageOrderValue: 100,
  },
};
