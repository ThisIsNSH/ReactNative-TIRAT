import React, { Component } from 'react';
import { Platform, StyleSheet, ImageBackground, Text, View } from 'react-native';
import { ImagePicker } from 'expo';
import Constants from 'expo-constants'
import { LinearGradient } from 'expo-linear-gradient'
import * as Permissions from 'expo-permissions'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Background from '../../assets/back.jpg'

const instructions = Platform.select({
  ios: 'iOS',
  android: 'Android',
  web: 'Web'
});

export default class Main extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      base64: true
    });

    console.log(result);

    if (!result.cancelled) {
      return fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyC0Ivg5CydfzOA0j8EMdwlA9coA33yft64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          "requests": [{
            "image": {
              "content": result.base64
            },
            "features": [{ "type": "TEXT_DETECTION" }]
          }
          ],
        }),
      }).then((response1) => response1.json())
        .then((responseJson) => {
          
          if (responseJson.responses[0].textAnnotations != undefined) {
            console.log(responseJson.responses[0].textAnnotations[0].description)
            console.log(responseJson.responses[0].textAnnotations[0].locale)
            this.props.navigation.navigate("Translation", {
              text: responseJson.responses[0].textAnnotations[0].description,
              locale: responseJson.responses[0].textAnnotations[0].locale,
            })
            this.setState({
              description: responseJson.responses[0].textAnnotations[0].description,
              locale: responseJson.responses[0].textAnnotations[0].locale
            });

          }
          else {
            console.log("Some Error")
            alert('Sorry, couldn\'t find any text!');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };


  render() {
    const resizeMode = 'cover';

    return (
      <ImageBackground style={{ flex: 1, resizeMode, }} source={Background}>
        <LinearGradient colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']} style={styles.container}>
          <View style={styles.topView}>
            <Text style={styles.title}>TIRAT<Text style={styles.instructions}>{instructions}</Text></Text>
            <Text style={styles.subtitle}>TEXT IN IMAGE RECOGNITION{"\n"}AND TRANSLATION</Text>
          </View>
          <View style={styles.bottomView}>
            <TouchableOpacity onPress={this._pickImage}>
              <LinearGradient colors={['#f3f3f3', '#fff']} style={styles.button}>
                <Text style={styles.getstarted} >Translate</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topView: {
    flex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 65,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'AvenirNextCondensed-Bold',
  },
  subtitle: {
    fontSize: 15,
    marginTop: -10,
    textAlign: 'center',
    marginRight: 60,
    marginLeft: 60,
    color: 'white',
    fontFamily: 'AvenirNext-Regular',
  },
  instructions: {
    textAlign: 'center',
    fontFamily: 'AvenirNext-Regular',
    color: 'white',
    fontSize: 20,
  },
  button: {
    margin: 30,
    borderRadius: 20,
  },
  getstarted: {
    color: '#000000',
    fontSize: 15,
    fontFamily: 'AvenirNextCondensed-Bold',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
  }
});
