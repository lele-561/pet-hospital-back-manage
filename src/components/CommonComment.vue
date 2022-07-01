<template>
  <comment :commentList=commentList :commentNum=commentList.length @doChidSend="doChidSend" @doSend="doSend">
  </comment>
</template>

<script>
import comment from 'bright-comment'
import {postRequest} from '../utils/api'

export default {
  name: 'CommonComment',
  components: {comment},
  props: ["noteId"],
  activated() {
    this.commentList = []
    postRequest('/comment/getCommentList', {id: this.noteId}).then((resp) => {
      this.commentList = resp.data
    })
    this.user.id = this.$store.state.user.token
    this.user.nickName = this.$store.state.user.userName
  },
  data() {
    return {
      user: {
        id: 789,
        nickName: "老六",
        // avatar: "null"
      },
      commentList: [
        // {
        //   id: 123,
        //   commentUser: {
        //     id: 789,
        //     nickName: "老六",
        //     // avatar: "null"
        //   },
        //   targetUser: {},
        //   content: "456789456",
        //   createDate: "2022-02-22",
        //   childrenList: [{
        //     id: 123,
        //     commentUser: {
        //       id: 789,
        //       nickName: "老六",
        //       // avatar: "null"
        //     },
        //     targetUser: {
        //       id: 780,
        //       nickName: "老八",
        //       // avatar: "null"
        //     },
        //     content: "哈哈哈哈哈哈",
        //     createDate: "2022-02-22",
        //   }]
        // }
      ]
    }
  },
  methods: {
    doSend(text) {
      postRequest('/comment/postComment', {
        noteId: this.noteId,
        userId: this.user.id,
        content: text
      }).then((resp) => {
        this.commentList = resp.data
      })
    },
    doChidSend(text, targetUserId, parentId) {
      postRequest('/comment/postChildrenComment', {
        noteId: this.noteId,
        userId: this.user.id,
        toUserId: targetUserId,
        parentId: parentId,
        content: text
      }).then((resp) => {
        this.commentList = resp.data
      })
    }
  },
}
</script>

<style>
</style>