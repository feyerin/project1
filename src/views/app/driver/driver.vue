<template>
<div>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4">
    
        <div class="mb-2 mt-2">
          <b-row>
                <b-colxx >
                  <div class="d-block d-md-inline-block pt-1">
                        <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                            <b-input :placeholder="$t('menu.search')" v-model="search" @change="searchData()"/>
                        </div>
                        <span class="text-muted text-small mr-1 mb-2">{{currentPage}} of {{ all_page }}</span>
                        <b-dropdown id="ddown2" right :text="`${perPage}`" variant="outline-dark" class="d-inline-block" size="xs">
                            <b-dropdown-item v-for="(size,index) in pageSizes" :key="index" @click="changePageSize(size)">{{ size }}</b-dropdown-item>
                        </b-dropdown>
                    </div>
                </b-colxx>
            </b-row>
        </div>
        
        <div class="border-bottom pt-4 mb-5"></div>
        
        
        <b-table
            ref="history"
            class="vuetable"
            sort-by="title" 
            sort-desc.sync="false"
            @row-selected="rowSelected"
            fixed="fixed"
            :per-page="perPage"
            :select-mode="bootstrapTable.selectMode"
            :current-page="currentPage"
            selectedVariant="primary"
            :fields="bootstrapTable.fields"
            :items="data"
          >
         <template v-slot:cell(actions)="row">
            <router-link tag="a" :to="{name:'historyOrder', params: { id: id }}"> 
                <b-button @click="passingID(row.item)" variant="secondary" class="mr-1 float-md-left btn-group" size="xs">
                    Detail              
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
          { key: 'merchant_name', label: 'Driver Name', sortable: false, sortDirection: 'desc', tdClass: 'list-item-heading' },
          { key: 'address', label: 'Phone Number', sortable: false, size:'20px'},
          { key: 'merchant_phone_number', label: 'Email', sortable: false },
          { key: 'status', label: 'Total Merchant', sortable: false },
          { key: 'email_address', label: 'Total Income', sortable: false },
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
        localStorage.setItem('merchantId', JSON.stringify(this.id))   
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
      let current = this.currentPage
      let size = this.perPage
      const params = {
        current_page : this.currentPage,
        page_size : this.pageSizes,
      }
      const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
      let promise = axios.get(urlProd + `/api/v1/acquisition/dashboard/listMerchant?pageSize=${size}&page=${current}&keyword=${this.search}`, {headers:auth})
      return promise
        .then(result => result.data)
        .then((data) => {
          console.log('test',data.rows) 
          console.log('callback', data)
          this.currentPage = current
          this.perPage = size
          this.totalRows = data.count
          this.all_page = data.all_page
          const items = data.rows
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
  }
}
</script>
