import * as React from 'react';
import { Circle, Group, Image, Layer, Line, Stage, Text } from 'react-konva';
//import { v4 as uuidv4 } from 'uuid';
import { IStepProps } from '../types';
import createImage from '../utils/createImage';
// import { StepDetail } from './StepDetail';
import {
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelBody,
  DrawerPanelContent,
} from '@patternfly/react-core';
import './Visualization.css';

interface IVisualization {
  isError?: boolean;
  isLoading?: boolean;
  steps: IStepProps[];
}

const CIRCLE_LENGTH = 75;

const Visualization = ({ isError, isLoading, steps }: IVisualization) => {
  const yAxis = window.innerHeight / 2;

  const incrementAmt = 100;

  const stepsAsElements: any[] = [];
  const [isExpanded, setIsExpanded] = React.useState(false);
  const drawerRef = React.createRef<HTMLDivElement>();
  const selectedStepId = React.useRef();
  const [selectedStep, setSelectedStep] = React.useState<IStepProps>({
    apiVersion: '',
    icon: '',
    id: '',
    name: '',
    type: ''
  });

  steps.map((step, index) => {
    //const generateStepId = uuidv4();

    let inputStep = {
      ...step,
      data: { label: step.name },
      //id: generateStepId,
      id: index.toString(),
      position: { x: 300, y: yAxis }
    };

    // Grab the previous step to use for determining position and drawing edges
    const previousStep = stepsAsElements[index - 1];

    /**
     * Determine first & last steps
     * Label as input/output, respectively
     */
    switch (index) {
      case 0:
        // First item in `steps` array
        inputStep.position.x = 100;
        break;
      case steps.length - 1:
      default:
        // Last item & middle steps in `steps` array
        // Extract into common area for last & middle steps
        inputStep.position.x = previousStep.position?.x + incrementAmt;
        break;
    }

    stepsAsElements.push(inputStep);

    return;
  });

  const onDragEnd = e => {
  };

  const imageProps = {
    height: 40,
    width: 40
  };

  const handleClick = (e) => {
    // TODO: Cleanup
    if((selectedStepId.current && e.target.id() && (e.target.id() !== selectedStepId.current)) || !selectedStepId.current) {
      //console.log('e.target.id(): ' + e.target.id());
      const newSelectedStep = stepsAsElements[e.target.id()];
      //console.table(newSelectedStep);
      selectedStepId.current = e.target.id();
      setSelectedStep(newSelectedStep);
    }

    setIsExpanded(!isExpanded);
  };

  const onExpand = () => {
    // @ts-ignore
    drawerRef.current && drawerRef.current.focus();
  };

  const onCloseClick = () => {
    setIsExpanded(false);
  };

  const panelContent = (
      <DrawerPanelContent isResizable
                          id={'right-resize-panel'}
                          defaultSize={'500px'}
                          minSize={'150px'}>
        <DrawerHead>
          <span tabIndex={isExpanded ? 0 : -1} ref={drawerRef}>
            Step Details
          </span>
          <DrawerActions>
            <DrawerCloseButton onClick={onCloseClick}/>
          </DrawerActions>
        </DrawerHead>
        <DrawerPanelBody>
          <p><b>Name</b>: {selectedStep.name} </p>
          <p><b>Step ID</b>: {selectedStep.id}</p>
        </DrawerPanelBody>
      </DrawerPanelContent>
    );

  // Stage is a div container
  // Layer is actual canvas element (so you may have several canvases in the stage)
  // And then we have canvas shapes inside the Layer
  return (
    <>
      <Drawer isExpanded={isExpanded} onExpand={onExpand}>
        <DrawerContent panelContent={panelContent} className={'panelCustom'}>
          <DrawerContentBody>
            <Stage width={window.innerWidth} height={window.innerHeight}>
              <Layer>
                <Group x={100} y={200} onDragEnd={onDragEnd} draggable>
                  <Line
                    points={[
                      100, 0,
                      steps.length * incrementAmt, 0
                    ]}
                    stroke={'black'}
                    strokeWidth={3}
                    lineCap={'round'}
                    lineJoin={'round'}
                  />
                  {stepsAsElements.map((item, index) => {
                    const image = {
                      id: item.id,
                      image: createImage(item.icon),
                      x: item.position.x - (imageProps.width / 2),
                      y: 0 - (imageProps.height / 2),
                      height: imageProps.height,
                      width: imageProps.width
                    };

                    return (
                      <Group key={index} onClick={handleClick}>
                        <Circle
                          x={item.position.x}
                          y={0}
                          key={index}
                          name={`${index}`}
                          stroke={index === 0 ? 'rgb(0, 136, 206)' : 'rgb(204, 204, 204)'}
                          fill={'white'}
                          strokeWidth={3}
                          width={CIRCLE_LENGTH}
                          height={CIRCLE_LENGTH}
                        />
                        <Image {...image} />
                        <Text x={item.position.x - (CIRCLE_LENGTH)} y={(CIRCLE_LENGTH / 2) + 10} align={'center'}
                              width={150} fontSize={11} text={item.name}/>
                      </Group>
                    )
                  })}
                </Group>
              </Layer>
            </Stage>
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export { Visualization };
