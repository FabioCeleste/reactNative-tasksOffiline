import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';

import commonStyles from '../commonStyles';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

// import { Container } from './styles';

interface Props {
  onCancel: () => void;
  isVisible: boolean;
  onSave: (newTask: {desc: string; date: Date}) => void;
}

const screens: React.FC<Props> = (props) => {
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  function initialState() {
    setDesc('');
    setDate(new Date());
    setShowDate(false);
  }

  function getDate() {
    let datePick = (
      <DateTimePicker
        value={date}
        mode="date"
        onChange={(_, newDate: Date) => {
          setDate(newDate);
          setShowDate(false);
        }}
      />
    );

    const dateString = moment(date).format('ddd, D [de] MMMM [de] YYYY');

    if (Platform.OS === 'android') {
      datePick = (
        <View>
          <TouchableOpacity onPress={() => setShowDate(true)}>
            <Text style={styles.date}>{dateString}</Text>
          </TouchableOpacity>
          {showDate && datePick}
        </View>
      );
    }

    return datePick;
  }

  function save() {
    const newTask = {desc, date};
    props.onSave(newTask);
    initialState();
  }

  return (
    <Modal
      transparent={true}
      visible={props.isVisible}
      onRequestClose={props.onCancel}
      animationType="slide">
      <TouchableWithoutFeedback onPress={props.onCancel}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>

      <View style={styles.container}>
        <Text style={styles.header}>Nova Tarefa</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe a Descrição"
          value={desc}
          onChangeText={(e) => setDesc(e)}
        />
        {getDate()}
        <View style={styles.buttons}>
          <TouchableOpacity onPress={props.onCancel}>
            <Text style={styles.button}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={save}>
            <Text style={styles.button}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={props.onCancel}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: commonStyles.colors.today,
    color: commonStyles.colors.secundary,
    textAlign: 'center',
    padding: 15,
    fontSize: 18,
  },

  input: {
    width: '90%',
    height: 40,
    margin: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 3,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 20,
    marginRight: 30,
    color: commonStyles.colors.today,
  },
  date: {
    fontSize: 20,
    marginLeft: 15,
  },
});

export default screens;
