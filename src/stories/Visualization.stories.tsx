import { Visualization } from '../components';
import { ComponentStory, ComponentMeta } from '@storybook/react';

// For now the only view data we care about are steps
//import steps from './data/steps';
//import views from './data/views';

export default {
  title: 'Visualization',
  component: Visualization,
} as ComponentMeta<typeof Visualization>;

const Template: ComponentStory<typeof Visualization> = () => {
  return (
    <>
      <h1>Visualization</h1>
    </>
  );
};

export const Kamelet = Template.bind({});
//Kamelet.args = { steps, views };

export const Integration = Template.bind({});
//Integration.args = { steps: [...steps, steps[1]] };
