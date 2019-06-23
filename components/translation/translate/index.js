import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import PropTypes from 'prop-types';

export default class Translate extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.text}</Text>
                <View style={{flexDirection: 'row',}}>
                    <LinearGradient colors={['#89f7fe', '#66a6ff']} style={styles.gradient}>
                        <Text style={styles.trans}>{this.props.trans}</Text>
                    </LinearGradient>
                </View>
                <View style={{height: 0.5, backgroundColor: '#bbb'}}></View>
            </View>
        );
    }
}

Translate.propTypes = {
    text: PropTypes.string,
    trans: PropTypes.string
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 16,
        marginRight: 16,
        borderRadius: 20,
        flexDirection: 'column'
    },
    text: {
        flex: 1,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 16,
        paddingBottom: 4,
        color: '#000',
        fontSize: 20,
        alignItems: 'flex-start',
        fontFamily: 'AvenirNextCondensed-Regular',
    },
    gradient: {
        borderRadius: 20,
        marginBottom: 20,
    },
    trans: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        color: '#000',
        fontSize: 20,
        alignItems: 'flex-start',
        fontFamily: 'AvenirNextCondensed-Medium',
    },
});
