<template>
<div>
  <b-row>
    <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('merchant')" />
        <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
      <b-tabs content-class="mt-3" fill>
          <b-tab title="PKP" active><merchant/></b-tab>
          <b-tab title="Non PKP"><merchantNonPkp/></b-tab>
      </b-tabs>
</div>
</template>
<script>
import merchant from '../merchant/merchant'
import merchantNonPkp from '../merchant/merchantNonPKP'

export default {


    components: {
        'merchant': merchant,
        'merchantNonPkp': merchantNonPkp,
    },
    data() {
        return {
        }
    },

}
</script>
