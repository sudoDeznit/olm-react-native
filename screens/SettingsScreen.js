import React, { Component } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    SafeAreaView,
    SectionList,
    Switch,
    Text,
    TouchableHighlight,
    View,
    Pressable,
    StyleSheet
} from 'react-native';
import { getTranslation, TransText } from 'react-native-translation';
import Icon from 'react-native-vector-icons/Ionicons';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { Body, SubTitle, Title, Header, Colors, Caption } from './components';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

import SettingsComponent from './pages/SettingsComponent';

class SettingsScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const lang = this.props.lang;

        return (
            <>
                <Header
                    leftContent={
                        <Pressable
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon
                                name="ios-chevron-back-outline"
                                color={Colors.white}
                                size={24}
                            />
                        </Pressable>
                    }
                    centerContent={
                        <Title
                            color="white"
                            dictionary={`${lang}.settings.settings`}
                        />
                    }
                    centerContainerStyle={{ flex: 2 }}
                    rightContent={
                        <Pressable onPress={() => this.props.logout()}>
                            <Body
                                color="white"
                                dictionary={`${lang}.settings.logout`}
                            />
                        </Pressable>
                    }
                />
                <View style={{ flex: 1 }}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.props.settingsModalVisible}>
                        {this.props.wait && (
                            <View style={styles.waitModal}>
                                <ActivityIndicator />
                            </View>
                        )}
                        {this.props.settingsEdit && (
                            <View style={styles.modal}>
                                <SettingsComponent />
                            </View>
                        )}
                    </Modal>

                    <View style={styles.container}>
                        <SectionList
                            stickySectionHeadersEnabled={false}
                            renderSectionHeader={({ section: { title } }) => (
                                <SubTitle
                                    color="muted"
                                    style={styles.sectionHeaderTitle}
                                    dictionary={`${lang}.${title}`}
                                />
                            )}
                            sections={[
                                {
                                    title: 'settings.my-account',
                                    data: [
                                        {
                                            id: 1,
                                            key: 'name',
                                            title: 'settings.name'
                                        },
                                        {
                                            id: 2,
                                            key: 'username',
                                            title: 'settings.username'
                                        },
                                        {
                                            id: 3,
                                            key: 'email',
                                            title: 'settings.email'
                                        }
                                    ]
                                },
                                {
                                    title: 'settings.privacy',
                                    data: [
                                        {
                                            id: 4,
                                            title: 'settings.show-name-maps'
                                        },
                                        {
                                            id: 5,
                                            title: 'settings.show-username-maps'
                                        },
                                        {
                                            id: 6,
                                            title: 'settings.show-name-leaderboards'
                                        },
                                        {
                                            id: 7,
                                            title: 'settings.show-username-leaderboards'
                                        },
                                        {
                                            id: 8,
                                            title: 'settings.show-name-createdby'
                                        },
                                        {
                                            id: 9,
                                            title: 'settings.show-username-createdby'
                                        }
                                    ]
                                },
                                {
                                    title: 'settings.picked-up',
                                    data: [
                                        {
                                            id: 11,
                                            title: 'settings.litter-picked-up'
                                        }
                                    ]
                                }
                                // Temp commented out. This feature will be fixed in a future release.
                                // {
                                //     title: 'settings.tags',
                                //     data: [
                                //         {
                                //             id: 10,
                                //             title: 'settings.show-previous-tags'
                                //         }
                                //     ]
                                // }
                            ]}
                            renderItem={({ item, index, section }) => (
                                <View style={styles.sectionRow} key={index}>
                                    {this._renderRow(item)}
                                </View>
                            )}
                            keyExtractor={(item, index) => item + index}
                        />
                    </View>
                </View>
                <SafeAreaView style={{ flex: 0, backgroundColor: '#f7f7f7' }} />
            </>
        );
    }

    /**
     * Custom Functions
     */
    _renderRow(item) {
        // name, username, email
        if (item.id <= 3) {
            return (
                <TouchableHighlight
                    underlayColor={'#95a5a6'}
                    style={{ flex: 1, padding: 10 }}
                    onPress={() =>
                        this._rowPressed(item.id, item.title, item.key)
                    }>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                        <Body dictionary={`${this.props.lang}.${item.title}`} />
                        <Body>{this._getRowData(item.id)}</Body>
                    </View>
                </TouchableHighlight>
            );
        } else {
            return (
                <View style={styles.switchRow}>
                    <Body dictionary={`${this.props.lang}.${item.title}`} />

                    {this._getRowData(item.id)}
                </View>
            );
        }
    }

    /**
     * Return the value for each row
     */
    _getRowData(id) {
        if (this.props.user) {
            if (id === 1) {
                return this.props.user.name;
            } else if (id === 2) {
                return this.props.user.username;
            } else if (id === 3) {
                return this.props.user.email;
            } else {
                return (
                    <Switch
                        onValueChange={() => this._toggleSwitch(id)}
                        value={this._getSwitchValue(id) === 0 ? false : true}
                    />
                );
            }
        }
    }

    /**
     * Toggle the Switch - Send post request to database
     */
    _toggleSwitch(id) {
        const lang = this.props.lang;

        const alert = getTranslation(`${lang}.settings.alert`);
        const info = getTranslation(
            `${lang}.settings.do-you-really-want-to-change`
        );
        const ok = getTranslation(`${lang}.settings.ok`);
        const cancel = getTranslation(`${lang}.settings.cancel`);

        Alert.alert(
            alert,
            info,
            [
                {
                    text: ok,
                    onPress: () => {
                        if (id === 11) {
                            this.props.saveSettings(
                                { id: 11, key: 'picked_up' },
                                !this.props.user.picked_up,
                                this.props.token
                            );
                        } else {
                            this.props.toggleSettingsSwitch(
                                id,
                                this.props.token
                            );
                        }
                    }
                },
                { text: cancel, onPress: () => console.log('cancel pressed') }
            ],
            { cancelable: true }
        );
    }

    /**
     * A Row was pressed - open onTextChange
     */
    _rowPressed(id, title, key = '') {
        this.props.toggleSettingsModal(id, title, key);
    }

    /**
     * Get the 0 or 1 value for a Switch
     *
     * INFO: show_name , show_username and picked_up have boolean values
     * rest have 0 & 1
     */
    _getSwitchValue(id) {
        switch (id) {
            case 4:
                return this.props.user.show_name_maps;
                break;
            case 5:
                return this.props.user.show_username_maps;
                break;
            case 6:
                return this.props.user.show_name === false ? 0 : 1;
                break;
            case 7:
                return this.props.user.show_username === false ? 0 : 1;
                break;
            case 8:
                return this.props.user.show_name_createdby;
                break;
            case 9:
                return this.props.user.show_username_createdby;
                break;
            case 10:
                return this.props.user.previous_tag;
                break;
            case 11:
                return this.props.user.picked_up === false ? 0 : 1;
                break;
            default:
                break;
        }
    }
}

const styles = StyleSheet.create({
    bottomImageContainer: {
        backgroundColor: '#ccc',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    },
    image: {
        height: 50,
        width: 50,
        borderRadius: 6
    },
    imageContainer: {
        backgroundColor: 'blue',
        width: SCREEN_WIDTH * 0.3,
        height: SCREEN_HEIGHT * 0.1,
        alignItems: 'center',
        padding: 10
    },
    logoutContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    modal: {
        backgroundColor: 'rgba(255,255,255,1)',
        flex: 1
    },
    // row: {
    //   backgroundColor: '#ccc',
    //   flexDirection: 'row',
    //   padding: 10
    // },
    sectionRow: {
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 2,
        flexDirection: 'row',
        height: SCREEN_HEIGHT * 0.06
    },
    text: {
        height: 30,
        borderColor: 'gray',
        borderWidth: 1,
        flex: 1
    },
    sectionHeaderTitle: {
        paddingLeft: 10,
        paddingTop: 20,
        paddingBottom: 5,
        textTransform: 'uppercase'
    },
    switchRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: SCREEN_HEIGHT * 0.01,
        justifyContent: 'space-between'
    },
    waitModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        lang: state.auth.lang,
        settingsModalVisible: state.settings.settingsModalVisible,
        token: state.auth.token,
        user: state.auth.user,
        wait: state.settings.wait,
        settingsEdit: state.settings.settingsEdit
    };
};

export default connect(mapStateToProps, actions)(SettingsScreen);
