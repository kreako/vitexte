import { ComponentStory, ComponentMeta } from "@storybook/react"

import Toolbar from "./Toolbar"

export default {
  title: "menu/Toolbar",
  component: Toolbar,
  argTypes: { onModeChange: { action: "onModeChange" } },
  decorators: [
    (Story) => (
      <div className="relative flex h-screen w-screen items-center justify-center bg-sky-50">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Toolbar>

const Template: ComponentStory<typeof Toolbar> = (args) => <Toolbar {...args} />

export const HorizontalSelect = Template.bind({})
HorizontalSelect.args = {
  orientation: "horizontal",
  toolMode: "select",
}

export const HorizontalSelect2Points = Template.bind({})
HorizontalSelect2Points.args = {
  orientation: "horizontal",
  toolMode: "select-2points",
}

export const HorizontalDelete = Template.bind({})
HorizontalDelete.args = {
  orientation: "horizontal",
  toolMode: "delete",
}

export const VerticalSelect = Template.bind({})
VerticalSelect.args = {
  orientation: "vertical",
  toolMode: "select",
}
