import { ComponentStory, ComponentMeta } from "@storybook/react"

import RawError from "./RawError"

export default {
  title: "error/RawError",
  component: RawError,
  argTypes: {},
  decorators: [(Story) => <Story />],
} as ComponentMeta<typeof RawError>

const Template: ComponentStory<typeof RawError> = (args) => <RawError {...args} />

export const Simple = Template.bind({})
Simple.args = {
  error: new Error("Un grave problème"),
}
