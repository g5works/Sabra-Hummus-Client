<template>
  <span v-html="parseMarkdown()"></span>
</template>

<script>

  import {marked} from 'marked';
  export default {
    name: 'HelloWorld',

    props: {
      markdown: { required: true, type: String },
    },


    methods:{
      parseMarkdown(){
        marked.use({
          pedantic: false,
          gfm: false,
          breaks: false,
          sanitize: false,
          smartLists: true,
          smartypants: false,
          xhtml: true
        });
        return marked.parseInline(this.markdown)

      },
    },
  }
</script>

<style scoped>
  p{
    margin:0; 
    margin-left: 60px; 
    white-space: pre-wrap;
  }
</style>
