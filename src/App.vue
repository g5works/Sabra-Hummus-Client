<template>
  <div class="parent-container">
    <div id="guildlist">
      <button
        v-for="(guild, index) in guildlist"
        :key="guild.id"
        class="serverbutton"
        :style="{
          backgroundImage: `url(https://hummus-stg-cdn.sys42.net/icons/${guild.id}/${guild.icon}.png)`,
        }"
        v-on:click="serverchanger($event, index)"
      >
        {{ checkforimage(guild.icon, guild.name, 4) }}
      </button>
    </div>

    <div id="channellist">
      <div id="servernamebar">
        <p
          style="
            font-size: 15pt;
            margin: 6px 0px;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
          "
        >
          {{ guildlist[selectedguild].name }}
        </p>
      </div>
      <div id="channels">
        <p class="typeheader" v-if="textchannels.length != 0">
          &nbsp;&nbsp;Text Channels
        </p>
        <button
          class="channelbutton"
          v-for="(channel, index) in textchannels"
          :key="channel.id"
          @click="changechannel(index)"
          style="border-left: solid 3px transparent;"
        >
          <i style="font-size: 14pt; margin-right: 15px" class="fal fa-hashtag"></i
          >{{ channel.name }}
        </button>
        <p class="typeheader" v-if="voicechannels.length != 0">
          &nbsp;&nbsp;Voice Channels
        </p>
        <button
          class="channelbutton"
          v-for="channel in voicechannels"
          :key="channel.id"
          style="border-left: solid 3px transparent"
        >
          <i
            style="font-size: 14pt; margin-right: 15px"
            class="fal fa-microphone-stand"
          ></i
          >{{ channel.name }}
        </button>
      </div>
    </div>

    <div id="therest">
      <div id="menubar">
        <p
          style="
            font-size: 15pt;
            margin: 6px 0px;
            padding-right: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-right: solid 1px #9da8d1;
            display: inline-block;
            max-width: 250px;
          "
        >
          <i class="far fa-hashtag"></i>&nbsp;{{ textchannels[selectedchannel].name}}
        </p>
        <p
          style="
            margin: 9px 0px;
            margin-left: 5px;
            width: calc(100% - 250px - 10px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
          "
        >
          {{ textchannels[selectedchannel].topic }}
        </p>
      </div>
      <div id="messages">
        <infinite-loading direction="top" :identifier="channelid" @infinite="infiniLoadHandle" spinner="wavedots">
          <!-- <div slot="spinner">
            <svg width="50px" height="50px" class="spinny">
              <circle class="loader" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
          </div> -->
          <div slot="no-more">
            <div class="no-messages">
              <p>You have reached the top of the message history for this channel</p>
            </div>
          </div>
          <div slot="no-results">
            <div class="no-messages">
              <p>You have reached the top of the message history for this channel</p>
            </div>
          </div>
        </infinite-loading>
        <div class="messagebody" v-for="message in messages" :key="message.id">
          <div
            class="message-avatar"
            :style="{ backgroundImage: `url(https://hummus-stg-cdn.sys42.net/avatars/${message.author.id}/${message.author.avatar}.png?size=256)`}"
          ></div>
          <div class="message-content">
            <span class="character-title">{{message.author.username}}</span>
            <p class="message-text">{{message.content}}</p>
          </div>
        </div>
      </div>  
      <div id="sender">
        <div class="chatarea">
          <button class="chatbutton file-send"><i class="fal fa-file-upload"></i></button>
          <div class="vertical-divider"></div>
          <button class="chatbutton emote-list"><i class="fal fa-smile"></i></button>
          <div class="vertical-divider"></div>

          <div class="textbox-location">
            <textarea
              placeholder="Message this channel"
              rows="1"
              class="message-area"
              @input="chatresize"
            ></textarea>
          </div>

          <div class="vertical-divider"></div>
          <button class="message-send"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </div>

    <div id="memberlist">
      <i class="fal fa-comment"></i>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");

:root {
  --item-height: 60px;
}

html,
body {
  margin: 0;
  padding: 0;
}

.typeheader {
  text-transform: uppercase;
  font-size: 9pt;
  margin-bottom: 5px;
  border-bottom: solid 1px gray;
  color: gray;
}

button {
  outline: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6,
span {
  font-family: "Open Sans";
  color: white;
}

.textbox-location {
  width: 20px;
  flex: 1 1 auto;
  display: flex;
}

.channelbutton {
  width: 100%;
  height: 40px;
  text-align: left;
  border: none;
  color: white;
  background-color: transparent;
  font-family: "Open Sans";
  font-size: 12pt;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.channelbutton:hover {
  background-color: rgba(0, 0, 0, 0.186);
}

.message-area {
  align-self: center;
  height: 60;
  flex: 1 1 auto;
  background-color: transparent;
  border: none;
  color: white;
  font-family: "Open Sans";
  outline: none;
  resize: none;
  padding: 0px 10px;
  font-size: 10pt;
}

.message-area::-webkit-scrollbar {
  width: 10px;
}

/* Track */
.message-area::-webkit-scrollbar-track {
  background: #3b3b3b;
}

/* Handle */
.message-area::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background: rgb(46, 46, 46);
  border: solid 2.5px #3b3b3b;
}

/* Handle on hover */
.message-area::-webkit-scrollbar-thumb:active {
  background: rgb(66, 66, 66);
}

.file-send,
.emote-list {
  color: gray;
}

.file-send:hover {
  color: rgb(74, 137, 255);
}

.emote-list:hover {
  color: rgb(255, 255, 115);
}

.message-send {
  color: rgb(255, 255, 255);
  background-color: #6b6b6b;
  border: none;
  border-radius: 100px;
  width: 40px;
  font-size: large;
  transition: 0.3s;
  margin-left: 5px;
}

.message-send:hover {
  background-color: #7289da;
}

.chatarea {
  display: flex;
  border: solid gray 1px;
  border-radius: 5px;
  outline: none;
  padding: 2px;
  min-height: 39px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.chatbutton {
  background-color: transparent;
  border: none;
  border-radius: 5px;

  font-size: 18pt;
  transition: 0.3s;
}

.vertical-divider {
  border-left: solid 1px rgb(82, 82, 82);
}

.chatbutton:hover {
  background-color: rgba(0, 0, 0, 0.055);
}

.chatbutton:active {
  background-color: rgba(0, 0, 0, 0.116);
}

#guildlist {
  float: left;
  height: 100vh;
  width: 60px;
  background-color: rgb(40, 40, 40);
  box-sizing: border-box;
  padding: 5px 5px;
  overflow: auto;
}
#guildlist::-webkit-scrollbar {
  display: none;
}

#channellist {
  display: flex;
  float: left;
  height: 100vh;
  width: 250px;
  background-color: rgb(50, 50, 50);

  flex-direction: column;
}

#memberlist {
  float: right;
  height: 100vh;
  width: 220px;

  position: relative;
  background-color: rgb(40, 40, 40);
}

/*#menubar{
    position: absolute;
    height: 40px;
    background-color: #7289da;
    width: calc(100% - 60px - 250px - 220px - 10px);
    padding: 5px;
  }*/

#therest {
  float: left;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: calc(100% - 60px - 250px - 220px);
  background-color: rgb(75, 75, 75);
}

#menubar {
  position: sticky;
  display: flex;
  background-color: #7289da;
  padding: 5px;
}

#servernamebar {
  position: sticky;
  background-color: #3c3c3c;
  padding: 5px;
}

#messages {
  overflow: auto;
  flex: 1 1 auto;
}

#channels {
  overflow: auto;
  flex: 1 1 auto;
}
#channels::-webkit-scrollbar {
  width: 10px;
}

/* Track */
#channels::-webkit-scrollbar-track {
  background: #3b3b3b;
}

/* Handle */
#channels::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background: rgb(46, 46, 46);
  border: solid 2.5px #3b3b3b;
}

/* Handle on hover */
#channels::-webkit-scrollbar-thumb:active {
  background: rgb(66, 66, 66);
}

#messages::-webkit-scrollbar {
  width: 10px;
}

/* Track */
#messages::-webkit-scrollbar-track {
  background: #3b3b3b;
}

/* Handle */
#messages::-webkit-scrollbar-thumb {
  border-radius: 100px;
  background: rgb(46, 46, 46);
  border: solid 2.5px #3b3b3b;
}

/* Handle on hover */
#messages::-webkit-scrollbar-thumb:active {
  background: rgb(66, 66, 66);
}

#sender {
  background-color: rgb(63, 63, 63);
  padding-left: 5px;
  padding-right: 5px;
}

.v-break {
  border-left: black 5px solid;
}

/* .slide-members-enter-active, .slide-members-leave-active{
    transition: all .5s;
  }

  .slide-members-enter, .slide-members-leave-to{
    transform: translate(220px,0);
  } */

.messagebody {
  width: calc(100% - 10px);
  min-height: 60px;
  background-color: transparent;
  border-top: inset rgb(190, 190, 190) 1px;
  padding: 5px;
}

.circular-image {
  border-radius: 100px;
}

.message-avatar {
  height: 50px;
  width: 50px;
  margin: 0;
  background-size: 50px;
  border-radius: 100px;
  float: left;
  margin-right: 10px;
}

.message-content {
  padding-left: 60px;
}

.character-title {
  font-size: 11pt;
  font-weight: bold;
}

.message-text {
  font-size: 10pt;
  margin-top: 5px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.serverbutton {
  height: 50px;
  width: 50px;
  border: none;
  box-sizing: border-box;
  background-size: 50px 50px;
  padding: 0;
  margin-bottom: 5px;
  background-color: rgba(255, 255, 255, 0.171);
  transition: 0.3s;
  border-radius: 100px;
  font-family: "Open Sans";
  color: white;
  font-size: 12pt;
}

.serverbutton:hover {
  background-color: rgba(255, 255, 255, 0.058);
}

.serverbutton img {
  margin: 0;
  border-radius: 100px;
  transition: 0.3s;
}

.change-radius {
  border-radius: 15px;
}

@keyframes offsetting {
  0%{
    stroke-dasharray: 10;
  }

  50% {
    stroke-dasharray: 80;
  }

  100%{
    stroke-dasharray: 10;
  }
}

.loader{
  stroke: rgb(170, 170, 170);
  stroke-width: 4px;
  stroke-dasharray: 80;
  animation: offsetting 5s linear infinite;
}

@keyframes speen{
  from{
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.spinny {
  animation: speen 1s linear infinite
}

</style>

<script lang="js">
// import Marked from './components/Marked.vue'
import axios from 'axios'


import _ from 'underscore';
// import { exists } from 'tauri-plugin-fs-extra-api'
// import {fs} from '@tauri-apps/api'

export default {
  name: 'App',
  components: {
    // Marked
  },

  data: () => {
    return {
      slidepanel: true,
      chatboxcontent: undefined,
      chatboxsendicon: "",

      guildlist: [],
      guildchannels: [],
      selectedguild: 0,
      selectedchannel: undefined,

      guilddata: [],

      channelposition: 0,

      gatewaySocket: undefined,

      token: "OTkxODMyNzY5ODgyMjU1Mzcx.YqkULw.xSNZ4-5fvYTq4mm9cMEh99ysT0t8Ncm5FcpFow",
      messages: [],
      servername: "x",
      serverid: undefined,
      channelname: undefined,
      channelid: undefined,
      sequencing: null,
      heartbeat: undefined,
      serveridsvisited: [],
    }
  },
  methods: {
    async infiniLoadHandle($state){
      console.log("bottomed out")
      if(this.messages === null || this.messages === undefined || this.messages.length === 0){
        await axios.get(`https://hummus.sys42.net/api/channels/${this.channelid}/messages?limit=50`, {headers: {"Authorization": `${this.token}`}}).then((result)=>{
                console.log("messages get")
                if (result.data.length){
                  var first_message = (result.data[0].content).split(/[<>]+/)
                  console.log(first_message)

                  var index = 0
                  console.log(first_message.forEach((item) => {item.includes('@'); index++; return index}))
                  this.messages.unshift(...result.data.reverse())
                  
                  console.log(result.data.length)
                  $state.loaded();
                }
                else{
                  $state.complete()
                }
                
        })
      }

      else{
        // https://hummus.sys42.net/api/v6/channels/909523692261834752/messages?before=1021170999828050805&limit=50
        await axios.get(`https://hummus.sys42.net/api/v6/channels/${this.channelid}/messages?before=${this.messages[0].id}&limit=50`, {headers: {"Authorization": `${this.token}`}}).then((result)=>{
                
                console.log("history get")
                var reversedmessages = result.data.reverse()
                reversedmessages.pop()
                console.log(reversedmessages)
                if (reversedmessages.length){
                  console.log(reversedmessages.length)
                  this.messages.unshift(...reversedmessages)
                  $state.loaded();
                }
                else{
                  $state.complete()
                }
                
        })
      }

      
      // $state.loaded()

    },

    chatresize(e) {
      e.target.style.height = 'auto'

      if (e.target.scrollHeight <= 300){
        e.target.style.height = `${e.target.scrollHeight}px`
      }
      else{
        e.target.style.height = `300px`
      }


    },

    abbreviate(str, length) {
      var strabbr = str.split(" ")
      var abbreviation = ""
      strabbr.forEach(item => {
        abbreviation += item.charAt(0)
      })
      return abbreviation.substring(0, length)
    },

    async changechannel(channelindex){
      var channels = document.querySelectorAll(".channelbutton")

      channels.forEach(item => {
        item.style.backgroundColor = 'transparent'
        item.style.borderLeft = 'solid 3px transparent'
      })
      this.selectedchannel = channelindex
      channels[this.selectedchannel].style.backgroundColor = 'rgba(0, 0, 0, 0.25)'
      channels[this.selectedchannel].style.borderLeft = 'solid 3px orange'
      this.channelid = this.textchannels[channelindex].id
      window.localStorage.setItem(this.guildlist[this.selectedguild].id, channelindex)
      this.messages = []
      
      axios.get(`https://hummus.sys42.net/api/channels/${this.channelid}/messages?limit=50`, {headers: {"Authorization": `${this.token}`}}).then((result)=>{
        // this.messages.push(result.data)
        this.messages = result.data.reverse()
      })
      // axios.get(`https://hummus.sys42.net/api/channels/${this.channelid}/messages`)

    },

    async serverchanger(e, guildindex){
      const guildicons = document.querySelectorAll(".serverbutton")
      guildicons.forEach(item => {
        item.style.borderRadius = "30px"
      })
      e.target.style.borderRadius = "15px"

      this.selectedguild = guildindex
      this.guildchannels = this.guildlist[this.selectedguild].channels

      var schannel = window.localStorage.getItem(this.guildlist[guildindex].id)

      schannel = schannel === null ? 0 : schannel

      this.selectedchannel = schannel
      this.channelid = this.textchannels[schannel].id

      window.localStorage.setItem("selectedserver", guildindex)

      this.serveridsvisited.push(this.guildlist[this.selectedguild].id)
      var self = this
      this.gatewaySocket.send(JSON.stringify({
        op: 12,
        t: "GUILD_SYNC",
        d: [...self.serveridsvisited]
      }))
      
      axios.get(`https://hummus.sys42.net/api/channels/${this.channelid}/messages?limit=50`, {headers: {"Authorization": `${this.token}`}}).then((result)=>{
        this.messages = result.data.reverse()
      })
      this.messages = []
    },

    async getUserData(){
      this.gatewaySocket.addEventListener('message', async (event) => {
        var eventdata = JSON.parse(event.data)
        switch (eventdata.t){
          case "READY":
            this.guildlist = eventdata.d.guilds
            console.log(window.localStorage.getItem("selectedserver"))
            this.selectedguild = window.localStorage.getItem("selectedserver")
            this.guildchannels = this.guildlist[this.selectedguild].channels
            var schannel = window.localStorage.getItem(this.guildlist[this.selectedguild].id)

            schannel = schannel === null ? 0 : schannel

            this.selectedchannel = schannel
            this.channelid = this.textchannels[schannel].id
            
            this.serveridsvisited.push(this.guildlist[this.selectedguild].id)
           
            var self = this
            this.gatewaySocket.send(JSON.stringify({
              op: 12,
              t: "GUILD_SYNC",
              d: [...self.serveridsvisited]
            }))
            break
          case "MESSAGE_CREATE":
            if (eventdata.d.guild_id == this.guildlist[this.selectedguild].id && eventdata.d.channel_id == this.textchannels[this.selectedchannel].id){
              this.messages.push(eventdata.d)
            }
            
        }
      })
    },

    checkforimage(image, title, abbrcount) {
      if(image == null){
        return this.abbreviate(title, abbrcount)
      }
    }

  },


  computed: {
    textchannels(){
      var grouped = _.groupBy([...this.guildchannels], (array)=>{return array.type})
      if (grouped[0] == null){
        return []
      }

      else {
        return grouped[0].sort((a, b) => {return a.position - b.position})
      }
    },

    voicechannels(){
      var grouped = _.groupBy([...this.guildchannels], (array)=>{return array.type})

      if (grouped[2] == null){
        return []
      }

      else {
        return grouped[2].sort((a, b) => {return a.position - b.position})
      }

    }

  },


  async created(){
    this.gatewaySocket = new WebSocket("wss://hummus-stg-gateway.sys42.net/?v=6&encoding=json")
    var self = this

    if (window.localStorage.getItem("selectedserver") === null){
      window.localStorage.setItem("selectedserver", 0)
    }

    console.log(window.localStorage.getItem("selectedserver"))

    this.gatewaySocket.addEventListener("open", () => {
        self.gatewaySocket.send(JSON.stringify({
          op: 2,
          d: {
            token: this.token,
            intents: 513,
            properties: {
              $os: "linux",
              $browser: "disco",
              $device: "disco"
            }
          }

        }))
      })
    this.gatewaySocket.addEventListener('message', (event) => {
        var eventdata = JSON.parse(event.data)
        switch(eventdata.op){
            case 10:
                this.sequencing = eventdata.s
                var heartbeat = eventdata.d.heartbeat_interval
                console.log('beat')
                self.gatewaySocket.send(JSON.stringify({
                    op: 1,
                    d: this.sequencing
                }))
                setInterval(() => {
                    self.gatewaySocket.send(JSON.stringify({
                        op: 1,
                        d: this.sequencing
                    }))
                }, heartbeat)
                break;
        }
      });

    await this.getUserData()




  },

  updated() {
    var guildicons = document.querySelectorAll(".serverbutton")
    var channels = document.querySelectorAll(".channelbutton")
    guildicons.forEach(item => {
        item.style.borderRadius = "30px"
    })
    channels.forEach(item => {
        item.style.backgroundColor = 'transparent'
        item.style.borderLeft = 'solid 3px transparent'
      })
    channels[this.selectedchannel].style.backgroundColor = 'rgba(0, 0, 0, 0.25)'
    channels[this.selectedchannel].style.borderLeft = 'solid 3px orange'
    guildicons[this.selectedguild].style.borderRadius = '15px'
  },

}
</script>
