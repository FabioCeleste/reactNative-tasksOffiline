import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/pt-br';

import Swipeable from 'react-native-gesture-handler/Swipeable';

import commonStyles from '../commonStyles';

// import { Container } from './styles';

interface Props {
  id: number;
  desc: string;
  estimateAt: string;
  doneAt: string | null;
  toggleTask: (id: number) => void;
  onDelete: (id: number) => {};
}

const Task: React.FC<Props> = (props) => {
  const doneOrNot =
    props.doneAt !== null ? {textDecorationLine: 'line-through'} : null;

  const formatDate = moment(props.estimateAt)
    .locale('pt-br')
    .format('ddd, D [de] MMMM');

  function getCheckView(done: string | null) {
    if (done !== null) {
      return (
        <View style={styles.done}>
          <Icons name="check" size={20} color="#fff" />
        </View>
      );
    }
    return <View style={styles.pending} />;
  }

  function getRight() {
    return (
      <TouchableOpacity
        style={styles.right}
        onPress={() => props.onDelete(props.id)}>
        <Icons name="trash" size={30} color="#fff" />
      </TouchableOpacity>
    );
  }
  function getLeft() {
    return (
      <View style={styles.left}>
        <Icons name="trash" size={20} color="#fff" />
        <Text style={styles.excludeText}>Excluir</Text>
      </View>
    );
  }

  return (
    <Swipeable
      renderRightActions={getRight}
      renderLeftActions={getLeft}
      onSwipeableLeftOpen={() => props.onDelete(props.id)}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => props.toggleTask(props.id)}>
          <View style={styles.checkContainer}>
            {getCheckView(props.doneAt)}
          </View>
        </TouchableWithoutFeedback>
        <View>
          <Text style={[styles.desc, doneOrNot]}>{props.desc}</Text>
          <Text style={styles.subText}>{formatDate}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#aaa',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },

  checkContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pending: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#555',
  },

  done: {
    height: 25,
    width: 25,
    borderRadius: 13,
    borderWidth: 1,
    backgroundColor: '#4d7021',
    alignItems: 'center',
    justifyContent: 'center',
  },

  desc: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.mainText,
    fontSize: 15,
  },
  subText: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.mainText,
    fontSize: 12,
  },
  right: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  excludeText: {
    color: 'white',
    fontSize: 20,
    margin: 10,
  },
  left: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Task;
