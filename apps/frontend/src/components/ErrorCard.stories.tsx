import { ComponentStory, ComponentMeta } from "@storybook/react"

import ErrorCard from "./ErrorCard"

export default {
  title: "error/ErrorCard",
  component: ErrorCard,
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="relative h-screen w-screen bg-sky-50">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof ErrorCard>

const Template: ComponentStory<typeof ErrorCard> = (args) => <ErrorCard {...args} />

export const Simple = Template.bind({})
Simple.args = {
  children: <div>C&apos;est une grave erreur !</div>,
}
