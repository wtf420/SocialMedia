import React, { useEffect, useState } from "react"
import { FlatList, Image, View } from "react-native"
import ItemRequestUser from "./ItemRequestUser"
import { getAllFrRequestOfUser } from "../../api/friendApi.jsx"
import { useDispatch, useSelector } from "react-redux"
import { getInfoUser } from "../../api/userApi"
import { replyRequestFr } from "../../api/friendApi.jsx"
import { Toast } from "./Toast"
import { addFriend } from "../../reducers/UserReducer"

const InvitationsList = props => {
  const { navigation } = props
  const token = useSelector(state => state.token.key)
  const uid = useSelector(state => state.uid.id)

  const dispatch = useDispatch()

  const [invitations, setInvitations] = useState([])

  const deleteInvitation = id => {
    const newInvitations = invitations.filter(obj => obj.idRq !== id)
    setInvitations(newInvitations)
  }

  const replyRequest = (rep, requestId) => {
    replyRequestFr(rep, uid, requestId, token)
      .then(response => {
        if (response.status === 204) {
          return response.data
        } else {
          console.log(response.status)
          throw new Error(response.data.errorMessage)
        }
      })
      .then(() => {
        deleteInvitation(requestId)
      })
      .catch(error => {
        Toast(error.message)
      })
  }

  const handleAccept = async (requestId, senderId) => {
    replyRequest("Accept", requestId)
    dispatch(addFriend(senderId))
  }

  const handleDecline = async requestId => {
    replyRequest("Decline", requestId)
  }

  const getNameInfo = id => {
    return getInfoUser(id)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else {
          console.log(response.status)
          throw new Error(response.data.errorMessage)
        }
      })
      .then(data => {
        const info = {
          name: data.name,
          profileImagePath: data.profileImagePath
        }
        return info
      })
      .catch(error => {
        Toast(error.message)
      })
  }

  useEffect(() => {
    getAllFrRequestOfUser(uid, token)
      .then(response => {
        if (response.status === 200) {
          return response.data
        } else {
          console.log(response.status)
          throw new Error(response.data.errorMessage)
        }
      })
      .then(data => {
        const promises = data.map(item => {
          const dateNow = new Date()
          const date = new Date(item.createdAt)
          const diffInMilliseconds = dateNow.getTime() - date.getTime()
          const diffInHours = Math.round(diffInMilliseconds / 3600000)

          return getNameInfo(item.senderId)
            .then(infoUser => {
              return {
                idRq: item._id,
                _id: item.senderId,
                name: infoUser.name,
                profileImagePath: infoUser.profileImagePath,
                datebetween: diffInHours + "h"
              }
            })
            .catch(error => {
              Toast(error.message)
            })
        })
        return Promise.all(promises)
      })
      .then(ArrayData => {
        setInvitations(ArrayData)
      })
      .catch(error => {
        Toast(error.message)
      })
  }, [token, uid])

  if (invitations.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={require("../../assets/images/NoRequest.png")}
          style={{
            width: 350,
            height: 350,
            alignSelf: "center",
            marginTop: 100
          }}
        />
      </View>
    )
  } else {
    return (
      <FlatList
        data={invitations}
        renderItem={({ item }) => (
          <ItemRequestUser
            item={item}
            navigation={navigation}
            nameRequest="Accept"
            nameRequest2="Decline"
            pressLeft={() => {
              handleAccept(item.idRq, item._id)
            }}
            pressRight={() => {
              handleDecline(item.idRq)
            }}
          />
        )}
        keyExtractor={(item, index) => "key" + index}
        showsVerticalScrollIndicator={false}
      />
    )
  }
}

export default InvitationsList
