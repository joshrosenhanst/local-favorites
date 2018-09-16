<template>
  <div class="field">
    <div class="control has-icons-left">
      <input type="text" class="input" :value="value" placeholder="Find places near..." ref="gmap-autocomplete" id="gmap-autocomplete" aria-label="Find places near this location" />
      <span class="icon is-small is-left">
        <font-awesome-icon icon="search"></font-awesome-icon>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GmapAutocompleteSearch',
  props: {
    value: String,
    placeholder: String
  }
}
</script>

<style lang="scss" scoped>

</style>

