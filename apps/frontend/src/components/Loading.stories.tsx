import { ComponentStory, ComponentMeta } from "@storybook/react"

import Loading from "./Loading"

export default {
  title: "generic/Loading",
  component: Loading,
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="relative h-screen w-screen bg-sky-50">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Loading>

const Template: ComponentStory<typeof Loading> = (args) => <Loading {...args} />

export const Simple = Template.bind({})
Simple.args = {
  size: 2,
}

export const Big = Template.bind({})
Big.args = {
  size: 10,
}

export const Reverse = Template.bind({})
Reverse.decorators = [
  (Story) => (
    <div className="relative h-screen w-screen bg-sky-600">
      <Story />
    </div>
  ),
]
Reverse.args = {
  size: 10,
  reverseColor: true,
}
