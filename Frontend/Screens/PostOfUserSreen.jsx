import { View, FlatList } from "react-native"
import React from "react"
import { useSelector } from "react-redux"
import ShowPosts from "../components/ui/ShowPosts"
import Header from "../components/ui/Header"

export default function PostOfUserSreen({ navigation, route }) {
  const StatusData = useSelector(state => state.statusPost.sub)
  const { userId } = route.params
  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <FlatList
        data={StatusData}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.author._id !== userId) return null
          return (
            <ShowPosts
              item={item}
              navigation={navigation}
              pressComment={() => {
                navigation.navigate("detailStatus", { idPost: item._id })
              }}
            />
          )
        }}
      />
      <View style={{ height: 5 }} />
    </View>
  )
}
