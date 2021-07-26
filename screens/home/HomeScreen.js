import React, { Component } from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Header
                    centerComponent={{
                        text: 'Dummy home',
                        style: { color: '#fff' }
                    }}
                    rightComponent={
                        <Pressable>
                            <Icon
                                name="ios-settings-outline"
                                color="white"
                                size={24}
                                onPress={() => {
                                    this.props.navigation.navigate('SETTING');
                                }}
                            />
                        </Pressable>
                    }
                />
                <View style={styles.container}>
                    <Text> Home screen </Text>
                </View>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default HomeScreen;
