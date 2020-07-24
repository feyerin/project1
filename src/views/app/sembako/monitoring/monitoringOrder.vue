<template>
<div>
  <b-row>
    <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('Monitoring')" />
        <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4">
        <div class="mb-2 mt-2">
          <b-row>
                  <div class="d-block d-md-inline-block pt-1">
                        <b-dropdown id="ddown1" :text="`${$t('status :')} ${status.column}`" variant="outline-dark" class="mr-1 float-md-left btn-group" size="xs">
                          <b-dropdown-item v-for="(status,index) in statusOptions" :key="index" @click="changeStatus(status)">{{ status.label }}</b-dropdown-item>
                        </b-dropdown>
                        <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                            <b-input :placeholder="$t('menu.search')" v-model="search" @change="searchData()"/>
                        </div>
                    </div>
                <b-colxx class="pt-1 float-md-left">
                  <div >
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
            :items="dataProvider"
          >
         <!-- <template v-slot:cell(actions)="">
            <router-link tag="a" class="float-lg-left" to="/app/sembako/driver-profile"><b-button variant="primary" size="xs"><i class="iconsminds-profile"/></b-button></router-link>
            <router-link tag="a" :to="{name:'detailOwner', params: { id: id }}"> 
                <b-button @click="passingID(row.item)" variant="secondary" class="mr-1 float-md-left btn-group" size="xs">
                  <i class="simple-icon-home"></i>              
                </b-button>
            </router-link> 
          </template> -->
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
import { urlProd, urlDev, apiDev, apiUrl } from '../../../../constants/config'
import axios from 'axios'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../../components/Common/VuetablePaginationBootstrap'

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
          content: ''
      },
      id : 400,
      search : "",
      status: '',
      pageSizes: [10, 20, 50],
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      all_page: 1,
      statusOptions: [
        {
          column: 'assigned',
          label: 'assigned'
        },
        {
          column: 'done',
          label: 'done'
        },
        {
          column: 'incoming',
          label: 'incoming'
        },
        {
          column: 'all',
          label: 'all'
        },
      ],
      bootstrapTable: {
        selected: [],
        selectMode: 'multi',
        fields: [
            { key: 'voucher_code_delivery', label: 'Voucher Code', sortable: false, sortDirection: 'desc', tdClass: 'list-item-heading' },
            { key: 'merchant_name', label: 'Merchant Name', sortable: false },
            { key: 'driver_name', label: 'Driver Name', sortable: false },
            { key: 'customer_name', label: 'Customer', sortable: false },
            // { key: 'merchant_phone_number', label: 'Phone', sortable: false },
            { key: 'created_at', label: 'Created At', sortable: false, formatter: (value) => { 
                  return value.substring(0, 19);
              } 
            },
            { key: 'order_status_name', label: 'Order Status', sortable: false, size:'20px'},
            { key: 'destination_address', label: 'Address', sortable: false, size:'20px'},
          ]
      }
    }
  },
  methods: {
    passingID(item) {
        this.id = item.id;
        localStorage.setItem('ownerID', JSON.stringify(this.id))   
        return item
    },
    changePageSize(perPage) {
      this.perPage = perPage;
     return perPage
    },
    rowSelected (items) {
      this.bootstrapTable.selected = items
    },
    changeStatus(status) {
      this.status = status;
      this.$refs.history.refresh();
      return status
    },
    dataProvider (ctx) {
      let status = this.status.label
      let current = this.currentPage
      let size = this.perPage
      const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
      let promise = axios.get(apiDev + `/api/bank-dki/v1/orders?page=${current}&status=${status}`, {headers:auth})
      return promise

        .then(result => result.data)
        .then((data) => {
          this.currentPage = data.meta.current_page
          this.perPage = data.meta.per_page
          this.totalRows = data.meta.count
          this.all_page = data.meta.total_pages
          const items = data.data
          console.log('test', data)
          return items;
        }).catch(_error => {
          return []
        })
    },
    preview(item,index,button){
      this.infoModalPreview.title = "Preview Data"
      this.infoModalPreview.content = item;
      this.$root.$emit('bv::show::modal', this.infoModalPreview.id, button)
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
