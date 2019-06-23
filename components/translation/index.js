import React, { Component } from 'react';
import { ListView, Picker, Text, ScrollView, View, StyleSheet } from 'react-native';
import Translate from './translate/index';

export default class Translation extends Component {

  static navigationOptions = {
    headerMode: 'Select Language',
    navigationOptions: {
        headerVisible: false,
    }
  };

  constructor(props) {
    super(props)

    this.text = ["Hello", "How are you?", "Good Morning", "What's your name?", "Thanks"];
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.updateLanguage = this.updateLanguage.bind(this);
    var i = 0;
    this.data1 = [];

    for (i = 0; i < this.text.length; i++) {
      this.data1.push({ text: this.text[i], trans: this.text[i] });
    }

    this.state = {
      dataSource: this.ds.cloneWithRows(this.data1),
      language: 'en',
      languages: []
    };



  }
  componentDidMount() {
    return fetch('https://gateway-lon.watsonplatform.net/language-translator/api/v3/identifiable_languages?version=2018-05-01', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic YXBpa2V5OndvSFF1MERhalpsOFFQc3FaUGF3OU92N080d2I4MmJVeXVPb0dMR0VwMFBh'
      }
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          languages: responseJson.languages,
        }, function () {

        });

      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateLanguage = (language) => {
    this.setState({ language: language })
    return fetch('https://gateway-lon.watsonplatform.net/language-translator/api/v3/translate?version=2018-05-01', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic YXBpa2V5OndvSFF1MERhalpsOFFQc3FaUGF3OU92N080d2I4MmJVeXVPb0dMR0VwMFBh',
        'Content-Type': 'application/json'
      }, body: JSON.stringify({
        text: this.text,
        model_id: 'en-' + language,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.translations == undefined) {
          this.setState({ language: language, dataSource: this.ds.cloneWithRows(this.data1) })
        } else {
          var i = 0;
          var data1 = [];
          for (i = 0; i < this.text.length; i++) {
            data1.push({ text: this.text[i], trans: responseJson.translations[i].translation });
          }
          this.setState({ language: language, dataSource: this.ds.cloneWithRows(data1) })
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  renderRow(rowData) {
    return <Translate text={rowData.text} trans={rowData.trans} />
  }

  render() {

    var pickers = [];
    var i;
    for (i = 0; i < this.state.languages.length; i++) {
      pickers.push(<Picker.Item key={this.state.languages[i].language} label={this.state.languages[i].name} value={this.state.languages[i].language} />);
    }

    return (
      <View>
        <ScrollView>
          <Picker style={{ marginLeft: 16, marginRight: 16 }} selectedValue={this.state.language} onValueChange={this.updateLanguage}>
            {pickers}
          </Picker>
          <View style={{ height: 0.5, marginLeft: 16, marginRight: 16, backgroundColor: '#bbb' }}></View>
          <ListView
            style={{ paddingBottom: 48 }}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  picker: {
    color: '#ff0000',
    fontSize: 20,
    marginBottom: -20,
    fontFamily: 'AvenirNextCondensed-Regular'
  }
});