import React, { PureComponent } from 'react';
import {
    Dimensions,
    FlatList,
    Keyboard,
    TextInput,
    View,
    Pressable,
    StyleSheet
} from 'react-native';
import { getTranslation } from 'react-native-translation';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { Body, Caption, Colors } from '../../components';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class LitterBottomSearch extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            text: ''
        };
    }

    /**
     * A tag has been selected
     */
    addTag(tag) {
        // update selected tag to execute scrollTo
        this.props.changeItem(tag);

        const newTag = {
            category: tag.category,
            title: tag.key
        };

        // currentGlobalIndex
        const currentIndex = this.props.swiperIndex;

        this.props.addTagToImage({
            tag: newTag,
            currentIndex
        });

        // clears text filed after one tag is selected
        this.setState({ text: '' });
    }

    /**
     *
     */
    clear() {
        this.setState({ text: '' });
    }

    /**
     * Close the litter picker and go back to the gallery screen
     */
    closeLitterPicker() {
        // litter_reducer
        this.props.resetLitterTags();

        // shared_reducer
        this.props.toggleLitter();
    }

    /**
     * Render a suggested tag
     */
    renderTag = ({ item }) => {
        return (
            <Pressable
                style={styles.tag}
                onPress={this.addTag.bind(this, item)}>
                <Caption
                    // style={styles.category}
                    dictionary={`${this.props.lang}.litter.categories.${
                        item.category
                    }`}
                />
                <Body
                    style={styles.item}
                    dictionary={`${this.props.lang}.litter.${item.category}.${
                        item.key
                    }`}
                />
            </Pressable>
        );
    };

    /**
     * Update text
     */
    updateText(text) {
        this.setState({ text });

        this.props.suggestTags(text, this.props.lang);
    }

    render() {
        const lang = this.props.lang;
        const suggest = getTranslation(`${lang}.tag.type-to-suggest`);
        return (
            <View>
                <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                    <TextInput
                        style={styles.textFieldStyle}
                        placeholder={suggest}
                        placeholderTextColor={Colors.muted}
                        onChangeText={text => this.updateText(text)}
                        selectionColor="black"
                        blurOnSubmit={false}
                        clearButtonMode="always"
                        value={this.state.text}
                        onSubmitEditing={() => {
                            this.updateText('');
                            Keyboard.dismiss();
                        }}
                    />
                </View>

                {this.props.isKeyboardOpen && (
                    <View style={styles.tagsOuterContainer}>
                        <Caption
                            style={styles.suggest}
                            dictionary={`${lang}.tag.suggested-tags`}
                            values={{
                                count: this.props.suggestedTags.length
                            }}
                        />

                        <FlatList
                            data={this.props.suggestedTags}
                            horizontal={true}
                            renderItem={this.renderTag}
                            keyExtractor={(item, index) => item.key + index}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textFieldStyle: {
        width: SCREEN_WIDTH - 40,
        height: 60,
        backgroundColor: '#fafafa',
        borderRadius: 12,
        padding: 10,
        borderColor: Colors.muted,
        borderWidth: 0.5
    },

    category: {
        marginBottom: SCREEN_HEIGHT * 0.01
    },

    item: {
        fontSize: SCREEN_HEIGHT * 0.02
    },
    suggest: {
        marginBottom: SCREEN_HEIGHT * 0.01
    },
    tag: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        marginRight: 10,
        borderWidth: 1,
        borderColor: Colors.muted
    },
    tagsOuterContainer: {
        marginLeft: 20,
        marginBottom: 40
    }
});

const mapStateToProps = state => {
    return {
        suggestedTags: state.litter.suggestedTags
    };
};

export default connect(
    mapStateToProps,
    actions
)(LitterBottomSearch);