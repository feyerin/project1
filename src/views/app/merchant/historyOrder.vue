<template>
<div>
  <b-row>
    <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('history order')" />
        <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="$t('table.historyOrder')">
        <div class="mb-2 mt-2">
              <b-row>
                <b-colxx >
                  <div class="d-block d-md-inline-block pt-1">
                        <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                            <b-input :placeholder="$t('menu.search')" v-model="search" @change="searchData()"/>
                        </div>
                    </div>
                </b-colxx>
                <b-colxx>
                    <div class="float-md-right pt-1">
                        <span class="text-muted text-small mr-1 mb-2">{{currentPage}} of {{ all_page }}</span>
                        <b-dropdown id="ddown2" right :text="`${perPage}`" variant="outline-dark" class="d-inline-block" size="xs">
                            <b-dropdown-item v-for="(size,index) in pageSizes" :key="index" @click="changePageSize(size)">{{ size }}</b-dropdown-item>
                        </b-dropdown>
                    </div>
                </b-colxx>
              </b-row>
        </div>
        
        <b-table
            ref="history"
            class="vuetable"
            sort-by="title" sort-desc.sync="false"
            @row-selected="rowSelected"
            :per-page="perPage"
            :select-mode="bootstrapTable.selectMode"
            :current-page="currentPage"
            selectedVariant="primary"
            :fields="bootstrapTable.fields"
            :items="dataProvider"
          >
         <template v-slot:cell(actions)="row">
              <b-button @click="preview(row.item, row.index,$event.target)" variant="secondary" class="mr-1 float-md-left btn-group" size="xs">
                <i class="simple-icon-eye"></i>
              </b-button>
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

          <!-- modal preview -->
          <b-modal :id="infoModalPreview.id" :title="infoModalPreview.title" size="lg" hide-footer>
            <b-row class="invoice-vue">
    <b-colxx xxs="12" class="mb-5">
        <b-card class="mb-5 invoice-contents" no-body>
           <b-card-body class="d-flex flex-column justify-content-between">
            <div class="d-flex flex-column">
      

            <div class="d-flex flex-row justify-content-between mb-5">
                <div class="d-flex flex-column w-70 mr-2 p-4 text-semi-muted bg-semi-muted">
                    <p class="mb-0">Destination Address</p>
                    <p class="mb-0">{{infoModalPreview.preview.destination_address}}</p>
                </div>
                <div class="d-flex w-30 flex-column text-right p-4 text-semi-muted bg-semi-muted">
                    <p class="mb-0">Invoice #: {{infoModalPreview.preview.id}}</p>
                    <p class="mb-0">{{infoModalPreview.preview.created_at}}</p>
                </div>
            </div>
            
            <div class="border-bottom pt-4 mb-5"></div>

              <table class="table table-borderless">
                <thead>
                    <tr>
                        <th class="text-muted text-extra-small mb-2">ITEM NAME</th>
                        <th class="text-muted text-extra-small mb-2">COUNT</th>
                        <th class="text-right text-muted text-extra-small mb-2">PRICE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in infoModalPreview.content" :key="index">
                        <td> {{infoModalPreview.content[index].menu_name}}</td>
                        <td>{{infoModalPreview.content[index].qty}}</td>
                        <td class="text-right">Rp. {{infoModalPreview.content[index].menu_price}}</td>
                    </tr>
                </tbody>
              </table>
            </div>

            <div class="d-flex flex-column">
              <div class="border-bottom pt-3 mb-5"></div>
              <table class="table table-borderless d-flex justify-content-end">
                  <tbody>
                      <tr>
                          <td class="text-semi-muted">Subtotal :</td>
                          <td class="text-right">Rp. {{infoModalPreview.preview.total_food_price}}</td>
                      </tr>
                       <tr>
                          <td class="text-semi-muted">Delivery Price :</td>
                          <td class="text-right">Rp. {{infoModalPreview.preview.delivery_price}}</td>
                      </tr>
                       <tr>
                          <td class="text-semi-muted">Total Food Discount :</td>
                          <td class="text-right">Rp. {{infoModalPreview.preview.total_food_discount}}</td>
                      </tr>
                      <tr class="font-weight-bold">
                          <td class="text-semi-muted">Total :</td>
                          <td class="text-right">Rp. {{infoModalPreview.preview.total_food_paid}}</td>
                      </tr>
                  </tbody>
              </table>
              <div class="border-bottom pt-3 mb-5"></div>
              <p class="text-muted text-small text-center">Invoice was created on a computer and is valid without the signature and seal. </p>
          </div>

           </b-card-body>
        </b-card>
    </b-colxx>
  </b-row>
          </b-modal>
          
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
          { key: 'customer_name', label: 'Customer', sortable: false },
          // { key: 'customer_phone_number', label: 'Customer Phone', sortable: false },
          { key: 'driver_name', label: 'Driver', sortable: false },
          { key: 'destination_address', label: 'Address', sortable: false },
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
    changePageSize(perPage) {
      this.perPage = perPage;
     return perPage
    },
    rowSelected (items) {
      this.bootstrapTable.selected = items
    },
    dataProvider (ctx) {
      const merchantId = JSON.parse(localStorage.getItem('merchantID'))
      let current = this.currentPage
      let size = this.perPage
      // const params = {
      //   current_page : this.currentPage,
      //   page_size : this.pageSizes,
      // }
      const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
      let promise = axios.get(urlProd + `/api/v1/acquisition/dashboard/orderByMerchant/${merchantId}?pageSize=${size}&pageNumber=${current}`, {headers:auth})
      return promise
        .then(result => result.data)
        .then((data) => {
          this.currentPage = current
          this.perPage = size
          this.totalRows = data.data.count
          this.all_page = data.totalPage
          const items = data.data.rows
          console.log('test', this.totalRows)
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
