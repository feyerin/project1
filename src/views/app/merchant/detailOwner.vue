<template>
<div>
    <b-row>
    <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('list merchant')" />
        <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="$t('List Merchant')">
        <div class="mb-2 mt-2">
              <b-row>
                <b-colxx >
                  <div class="d-block d-md-inline-block pt-1">
                        <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                            <b-input :placeholder="$t('menu.search')" v-model="search" @change="searchData()"/>
                        </div>
                    </div>
                </b-colxx>
              </b-row>
        </div>
        
        <b-table
            ref="history"
            class="vuetable"
            sort-by="title" sort-desc.sync="false"
            @row-selected="rowSelected"
            fixed="fixed"
            :select-mode="bootstrapTable.selectMode"
            selectedVariant="primary"
            :fields="bootstrapTable.fields"
            :items="dataProvider"
          >
         <template v-slot:cell(actions)="row">
              <router-link tag="a" :to="{name:'historyOrder', params: { id: id }}"> 
                <b-button v-b-tooltip.hover title="History" @click="passingID(row.item)" variant="secondary" class="mr-1 float-md-left btn-group" size="xs">
                  <i class="simple-icon-hourglass"></i>              
                </b-button>
            </router-link> 
          </template>
          </b-table>
        <b-pagination
            size="sm"
            align="center"
            :total-rows="totalRows"
            :per-page="perPage"
            v-model="currentPage"
          >
            <template v-slot:next-text>
              <i class="simple-icon-arrow-right"/>
            </template>
            <template v-slot:prev-text>
              <i class="simple-icon-arrow-left"/>
            </template>
            <template v-slot:first-text>
              <i class="simple-icon-control-start"/>
            </template>
            <template v-slot:last-text>
              <i class="simple-icon-control-end"/>
            </template>
          </b-pagination>
          
      </b-card>
    </b-colxx>
  </b-row>
  </div>
</template>
<script>
import { urlProd, urlDev } from '../../../constants/config'
import axios from 'axios'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../components/Common/VuetablePaginationBootstrap'

export default {
  components: {
    'vuetable' : Vuetable,
    'vuetable-pagination-bootstrap' : VuetablePaginationBootstrap
  },
  data () {
    return {
      infoModalPreview: {
          id: 'info-modal-preview',
          title: '',
          content: '',
          preview: ''
      },
      id : 400,
      search : "",
      pageSizes: [10, 20, 50],
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      all_page: 0,
      bootstrapTable: {
        selected: [],
        selectMode: 'multi',
        fields: [
          { key: 'id', label: 'Id merchant', sortable: false },
          { key: 'merchant_name', label: 'Merchant', sortable: false },
          { key: 'address', label: 'Address', sortable: false },
          { key: 'email_address', label: 'Email', sortable: false },
          { key: 'merchant_phone_number', label: 'Phone', sortable:  false},
          { key: 'created_at', label: 'Created At', sortable: false, formatter: (value) => { 
                return value.substring(0, 10);
            } 
           },
          { key: 'actions', label: 'Actions', sortable: false }
        ]
      }
    }
  },
  methods: {
      passingID(item) {
        this.id = item.id;
        localStorage.setItem('merchantID', JSON.stringify(this.id))   
        return item
    },
    changePageSize(perPage) {
      this.perPage = perPage;
     return perPage
    },
    rowSelected (items) {
      this.bootstrapTable.selected = items
    },
    dataProvider (ctx) {
      const owner_id = JSON.parse(localStorage.getItem('ownerID'))
      let current = this.currentPage
      let size = this.perPage
      // const params = {
      //   current_page : this.currentPage,
      //   page_size : this.pageSizes,
      // }
      const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
      let promise = axios.get(urlProd + `/api/v1/acquisition/dashboard/ownerDetail/${owner_id}`, {headers:auth})
      return promise
        .then(result => result.data)
        .then((data) => {
          console.log ('data', data)
          const items = data.merchants
          console.log('items', items)
          return items;
        }).catch(_error => {
          return []
        })
    },
    apiParamsConverter (params) {
      let apiParams = {}
      if (params.perPage !== 0) {
        apiParams.per_page = params.page_size
      }
      if (params.current_page >= 1) {
        apiParams.page = params.current_page
      }
      if (params.filter && params.filter.length > 0) {
        // Optional
      }
      return apiParams
    },
    changeOrderBy(sort) {
      console.log(sort)
      this.sort = sort
    },
    searchData(){
      console.log('cari', this.search)
        this.$refs.history.refresh();
    },
    preview(item,index,button){
      this.infoModalPreview.title = "Preview Data"
      this.infoModalPreview.preview = item;
      this.infoModalPreview.content = item.order_details;
      var temp = this.infoModalPreview.preview.created_at
      var res = temp.substring(0, 10);
      this.infoModalPreview.preview.created_at = res
      this.$root.$emit('bv::show::modal', this.infoModalPreview.id, button)
      console.log('asjdasd', this.infoModalPreview.order_details)
    },
  }
}
</script>
