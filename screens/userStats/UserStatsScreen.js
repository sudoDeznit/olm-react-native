import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Pressable,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { Body, Title, Header, Colors, StatsGrid } from '../components';
import { ProgressCircleCard } from './_components';

class UserStatsScreen extends Component {
    constructor(props) {
        super(props);
        // console.log(JSON.stringify(this.props.user, null, '\t'));
        this.state = {
            xpStart: 0,
            positionStart: 0,
            totalImagesStart: 0,
            totalTagsStart: 0
        };
    }

    componentDidMount() {
        this.getDataFromStorage();
    }

    async getDataFromStorage() {
        // data of previously viewd stats by user
        const previousStats = await AsyncStorage.getItem('previousUserStats');

        if (previousStats !== undefined && previousStats !== null) {
            const { xp, position, totalImages, totalTags } = JSON.parse(
                previousStats
            );
            this.setState({
                xpStart: xp,
                positionStart: position,
                totalImagesStart: totalImages,
                totalTagsStart: totalTags
            });
        }
        this.fetchUserData();
    }

    async fetchUserData() {
        await this.props.fetchUser(this.props.token);
        const user = this.props.user;
        const statsObj = {
            xp: user?.xp,
            position: user?.position,
            totalImages: user?.total_images,
            totalTags: user?.totalTags
        };
        // INFO: previous stats saved for animation purpose
        // so value animates from previous viewd and current
        AsyncStorage.setItem('previousUserStats', JSON.stringify(statsObj));
    }

    render() {
        const user = this.props.user;

        const statsData = [
            {
                value: user?.xp || this.state.xpStart,
                startValue: this.state.xpStart,
                title: 'XP',
                icon: 'ios-medal-outline',
                color: '#14B8A6',
                bgColor: '#CCFBF1'
            },
            {
                value: user?.position || this.state.positionStart,
                startValue: this.state.positionStart,
                title: 'Rank',
                icon: 'ios-podium-outline',
                color: '#A855F7',
                bgColor: '#F3E8FF',
                ordinal: true
            },
            {
                value: user?.total_images || this.state.totalImagesStart,
                startValue: this.state.totalImagesStart,
                title: 'Photos',
                icon: 'ios-images-outline',
                color: '#F59E0B',
                bgColor: '#FEF9C3'
            },
            {
                value: user?.totalTags || this.state.totalTagsStart,
                startValue: this.state.totalTagsStart,
                title: 'Tags',
                icon: 'ios-pricetags-outline',
                color: '#0EA5E9',
                bgColor: '#E0F2FE'
            }
        ];

        // TODO: add a better loading screen add Skeleton Loading screen
        if (user === null || user === undefined) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <ActivityIndicator size="small" color={Colors.accent} />
                </View>
            );
        }
        return (
            <>
                <Header
                    leftContent={
                        <View>
                            <Title color="white">Welcome</Title>
                            <Body color="white">{user?.username}</Body>
                        </View>
                    }
                    rightContent={
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
                <ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}>
                    <ProgressCircleCard
                        level={user?.level}
                        levelPercentage={user?.targetPercentage}
                        xpRequired={user?.xpRequired}
                        totalLittercoin={user?.totalLittercoin}
                        littercoinPercentage={user?.total_images % 100}
                    />

                    <StatsGrid statsData={statsData} />
                </ScrollView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    statsContainer: {
        marginTop: 20,
        padding: 10
    },
    statsRow: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    }
});

const mapStateToProps = state => {
    return {
        lang: state.auth.lang,
        token: state.auth.token,
        user: state.auth.user
    };
};

export default connect(
    mapStateToProps,
    actions
)(UserStatsScreen);
