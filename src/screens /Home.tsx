import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, TextInput, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../components/Button';
import Diamond from '../components/Diamond';
import Circle from '../components/Circle';
import Square from '../components/Square';
import Line from '../components/Line';
import FlowList from '../components/FlowList';

type Flow = {
  nodeName: string;
  desc: string;
  chain: flowChain[];
};

type flowChain = {
  nodeName: string;
  desc: string;
  chain: Flow[];
};

const Home = () => {
  const [flowData, setFlow] = useState<Flow[]>([]);
  const [workFlowName, setWorkFlowName] = useState<string>('');
  const [tempNode, setTempNode] = useState<Flow | null>(null);
  const [allWorkflows, setWorkflows] = useState();
  const [isFlowSelected, setIsFlowSelected] = useState(false);
  const [isCreatingFlow, setIsCreatingFlow] = useState(false);
  const isEndNode = flowData.some(item => item.nodeName === 'end');

  useEffect(() => {
    getWorkFlows();
  }, []);

  // render the shapes based on the nodeName
  const renderShape = (values: {nodeName: string; desc: string}) => {
    switch (values.nodeName) {
      case 'init':
        return <Circle description={values.desc} />;
      case 'conditional':
        return <Diamond description={values.desc} />;
      case 'action':
        return <Square description={values.desc} />;
      case 'end':
        return <Circle description={values.desc} />;
    }
  };

  //get the workflow list from the local storage
  const getWorkFlows = async () => {
    try {
      const data = await AsyncStorage.getItem('workflows');
      if (data && JSON.parse(data).length) {
        setWorkflows(JSON.parse(data));
      }
    } catch (e) {
      // saving error
    }
  };

  // saving the multiple workflows in the local storage in the form of array
  const saveWorkFlow = async () => {
    const savedWorkFlows = await AsyncStorage.getItem('workflows');
    let parsedData = [];
    if (savedWorkFlows && JSON.parse(savedWorkFlows)?.length) {
      parsedData = JSON.parse(savedWorkFlows);
      parsedData.push({name: workFlowName, workFlow: flowData});
    } else {
      parsedData.push({name: workFlowName, workFlow: flowData});
    }
    try {
      await AsyncStorage.setItem('workflows', JSON.stringify(parsedData));
      Alert.alert('Saved SuccessFully');
      getWorkFlows();
      setIsFlowSelected(false);
      setIsCreatingFlow(false);
    } catch (e) {
      // saving error
    }
  };

  const renderFlow = () => {
    const flowEl = flowData.map((item: Flow) => {
      return (
        <View>
          {renderShape(item)}
          {item.nodeName !== 'end' && <Line />}
          {item.chain?.map(child => {
            return (
              <>
                {renderShape(child)}
                <Line top={20} />
                {child.chain?.map(grandChild => {
                  return (
                    <>
                      {renderShape(grandChild)}
                      <Line />
                    </>
                  );
                })}
              </>
            );
          })}
        </View>
      );
    });
    return flowEl;
  };

  //setting up the temp node for naming them
  const setNodes = (name: string) => {
    const newNode = {
      nodeName: name,
      desc: '',
      chain: [],
    };
    setTempNode(newNode);
  };

  /**
   *
   * @param buttonVal
   * function to use for validation of the shapes
   */
  const onButtonsPress = (buttonVal: string) => {
    const isInitAvailable = flowData.some(item => item.nodeName === 'init');
    const isConditionalNode = flowData[0]?.chain?.some(
      item => item.nodeName === 'conditional',
    );
    const isActionNode = flowData[0]?.chain?.some(
      item => item.nodeName === 'action',
    );

    if (isInitAvailable && buttonVal !== ' init') {
      if (!isConditionalNode && buttonVal === 'action') {
        Alert.alert('plz add conditional first');
      } else if (buttonVal === 'action' && !isActionNode) {
        // logic
        setNodes('action');
      } else if (buttonVal === 'action' && isActionNode) {
        // logic
        Alert.alert('Action node already added');
      }

      if (buttonVal === 'conditional' && !isConditionalNode) {
        setNodes('conditional');
      } else if (buttonVal === 'conditional' && isConditionalNode) {
        Alert.alert('already added ');
      }

      if (buttonVal === 'end' && !isActionNode && !isConditionalNode) {
        Alert.alert('you cant add end node directly');
      } else if (buttonVal === 'end') {
        setNodes('end');
      }
    } else {
      if (buttonVal === 'init') {
        setNodes('init');
      } else {
        Alert.alert('plz add init node first');
      }
    }
  };

  /**
   *
   * @param val
   * setting the entity name in object
   */

  const onChange = (val: string) => {
    setTempNode({...tempNode, desc: val});
  };

  /**
   *
   * @param value
   * setting the workflow name to identify
   */

  const onChangeWorkFlowName = (value: string) => {
    setWorkFlowName(value);
  };

  // create dynamic array of entities of the flow
  const addToFLow = () => {
    if (tempNode?.nodeName === 'init') {
      setFlow([...flowData, tempNode]);
      setTempNode(null);
    } else if (tempNode?.nodeName === 'conditional') {
      const newArr = flowData.map(item => {
        return {
          ...item,
          chain: [tempNode],
        };
      });
      setFlow([...newArr]);
      setTempNode(null);
    } else if (tempNode?.nodeName === 'action') {
      let tempArr = flowData;
      const newArr = flowData[0].chain.map(item => {
        return {
          ...item,
          chain: [tempNode],
        };
      });
      tempArr[0].chain = newArr;
      setFlow([...tempArr]);
      setTempNode(null);
    } else {
      setFlow([...flowData, tempNode]);
      setTempNode(null);
    }
  };
  const renderInputs = (nodeName?: string) => {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={nodeName ? onChange : onChangeWorkFlowName}
          style={styles.inputText}
        />
        <Button
          text={nodeName || 'Save workflow'}
          onPress={nodeName ? addToFLow : saveWorkFlow}
        />
      </View>
    );
  };

  const onWorkflowSelect = item => {
    setIsFlowSelected(true);
    setFlow(item.workFlow);
  };

  if (!isFlowSelected && !isCreatingFlow) {
    return (
      <FlowList
        flows={allWorkflows}
        onSelect={onWorkflowSelect}
        onCreate={() => setIsCreatingFlow(true)}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={{paddingBottom: 60}}>
      <View style={styles.container}>
        {isCreatingFlow && (
          <View style={styles.buttonContainers}>
            <Button text="Init node" onPress={() => onButtonsPress('init')} />
            <Button text="End Node" onPress={() => onButtonsPress('end')} />
            <Button
              text="Conditional Node"
              onPress={() => onButtonsPress('conditional')}
            />
            <Button
              text="Action Node"
              onPress={() => onButtonsPress('action')}
            />
          </View>
        )}
        {tempNode && renderInputs(tempNode.nodeName)}
        {renderFlow()}
        {isEndNode && !isFlowSelected && isCreatingFlow && renderInputs()}
        <Button
          text="Goto workflows"
          onPress={() => {
            setIsFlowSelected(false);
            setIsCreatingFlow(false);
          }}
        />
        {!isCreatingFlow && (
          <Button
            text="Create workflow"
            onPress={() => {
              setIsFlowSelected(false);
              setFlow([]);
              setIsCreatingFlow(true);
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainers: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  inputText: {
    width: 180,
    height: 48,
    borderWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
});
