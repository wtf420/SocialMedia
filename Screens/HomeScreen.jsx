import { View ,FlatList , StyleSheet ,ActivityIndicator,ScrollView ,SectionList,SafeAreaView,RefreshControl } from "react-native";
import React, {useEffect, useState} from 'react';

import Colors from "../constants/Colors";
import ShowPosts from "../components/ui/ShowPost";
import {Toast} from '../components/ui/Toast';

import LottieView from 'lottie-react-native';
const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color="#aaa" />
      </View>
    ) : null;
  };

export default function HomeScreen() {
return (
    <SafeAreaView style={{flex: 1}}>
      {refreshing ? (
        <ActivityIndicator />
      ) : (
        <SectionList
          sections={sections}
          //keyExtractor={(item, index) => 'key ' + index}
          renderItem={() => {
            if (section.title === 'Stories') {
              return <StoriesList navigation={navigation} />;
            } else {
              return (
                <ShowPosts
                  item={item}
                  navigation={navigation}
                  pressComment={() => {
                    navigation.navigate('detailStatus', {idPost: item._id});
                  }}
                  pressDelete={() => {
                    //handleDelete(item._id);
                  }}
                />
              );
            }
          }}
          renderSectionFooter={({section}) => {
            if (section.title === 'Posts') {
              return renderLoader();
            } else {
              return null;
            }
          }}
          onEndReached={() => {
            if (!isLoading) loadMoreItem();
          }}
          onEndReachedThreshold={0}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
