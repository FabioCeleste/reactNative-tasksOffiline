import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/pt-br';

import AsyncStorage from '@react-native-community/async-storage';
import commonStyles from '../commonStyles';
import todayImage from '../../assets/imgs/today.jpg';

import Icons from 'react-native-vector-icons/FontAwesome';

import Task from '../components/Task';
import AddTask from './AddTask';

interface Task {
  doneAt: string | null;
  id: number;
  desc: string;
  estimateAt: Date;
}

const TaskList: React.FC = () => {
  const arrayTask: Task[] = [];
  const [showDoneTask, setShowDoneTask] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [update, setUpdate] = useState(true);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [tasks, setTasks] = useState(arrayTask);

  function toggleTask(taskId: number) {
    const tasksArray = [...tasks];
    tasksArray.forEach((task) => {
      if (task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date().toString();
      }
    });
    setTasks(tasksArray);
    setUpdate(true);
  }

  function initialState() {
    setShowDoneTask(true);
    setShowAddTask(false);
    setUpdate(false);
    setVisibleTasks([]);
    setTasks(arrayTask);
  }

  function toggleFilter() {
    setShowDoneTask(!showDoneTask);
    setUpdate(true);
  }

  function filterTask() {
    let newVisibleTask = null;
    if (showDoneTask) {
      newVisibleTask = [...tasks];
    } else {
      const pedding = (task) => {
        return task.doneAt === null;
      };
      newVisibleTask = tasks.filter(pedding);
    }
    setUpdate(false);
    setVisibleTasks(newVisibleTask);
    AsyncStorage.setItem('state', JSON.stringify(tasks));
  }

  function addNewTask(newtask: {desc: string; date: Date}) {
    if (!newtask.desc) {
      return;
    }
    const clonedTasks = [...tasks];
    clonedTasks.push({
      id: Math.random(),
      desc: newtask.desc,
      estimateAt: newtask.date,
      doneAt: null,
    });
    setTasks(clonedTasks);
    setShowAddTask(false);
    setUpdate(true);
  }

  function deleteTask(id: number) {
    const toDeleteTask = tasks.filter((task) => task.id !== id);
    setTasks(toDeleteTask);
    setUpdate(true);
  }

  useEffect(() => {
    if (update) {
      async function getStorage() {
        const stateString = await AsyncStorage.getItem('state');
        if (stateString) {
          const stateSave = JSON.parse(stateString);
          console.log(stateSave);
          setTasks(stateSave);
        }
      }
      filterTask();
      getStorage();
      setUpdate(false);
    }
  }, [update]);

  const today = moment().locale('pt-br').format('ddd, D [de] MMMM');

  return (
    <View style={styles.container}>
      <AddTask
        isVisible={showAddTask}
        onSave={addNewTask}
        onCancel={() => setShowAddTask(!showAddTask)}
      />
      <ImageBackground source={todayImage} style={styles.background}>
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={toggleFilter}>
            <Icons
              name={showDoneTask ? 'eye' : 'eye-slash'}
              size={20}
              color={commonStyles.colors.secundary}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title}>Hoje</Text>
          <Text style={styles.subTitle}>{today}</Text>
        </View>
      </ImageBackground>
      <View style={styles.taskList}>
        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <Task {...item} toggleTask={toggleTask} onDelete={deleteTask} />
          )}
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.7}
        onPress={() => setShowAddTask(true)}>
        <Icons name="plus" color={commonStyles.colors.secundary} size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 3,
  },

  taskList: {
    flex: 7,
  },

  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  title: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 50,
    color: commonStyles.colors.secundary,
    marginLeft: 20,
    marginBottom: 20,
  },

  subTitle: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 20,
    color: commonStyles.colors.secundary,
    marginLeft: 20,
    marginBottom: 30,
  },

  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'flex-end',
    marginTop: Platform.OS === 'ios' ? 30 : 10,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TaskList;
