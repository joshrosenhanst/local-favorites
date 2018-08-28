<template>
  <div class="field">
    <div class="control has-icons-left">
      <!--<input type="text" class="input" :value="value" placeholder="Search locations by name, address, or type..." ref="gsearchbox" id="gmap-search-box" />-->
      <input type="text" class="input" :value="value" placeholder="Enter a city..." ref="gmap-autocomplete" id="gmap-autocomplete" />
      <span class="icon is-small is-left">
        <font-awesome-icon icon="search"></font-awesome-icon>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GmapCitySearch',
  props: {
    value: String,
    placeholder: String
  }
}
</script>

<style lang="scss" scoped>

</style>

