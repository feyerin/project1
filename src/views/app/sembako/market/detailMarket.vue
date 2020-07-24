<template>
<b-row>
    <b-colxx xxs="12">
        <h1>Pasar Jaya</h1>
        <piaf-breadcrumb />
        <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" :no-fade="true">
            <b-tab :title="$t('profile')">
                <b-row>
                    <b-colxx xxs="12" class="mb-5">
                        <!-- <b-card>
                        </b-card> -->
                    </b-colxx>
                    <b-colxx xxs="2" lg="2" xl="3" class="col-left">
                        <b-card no-body class="mb-4">
                            <!-- <single-lightbox thumb="/assets/img/profile-pic.jpg" large="/assets/img/profile-pic.jpg" class-name="card-img-top" /> -->
                            <b-card-body>
                                <p class="text-muted text-small mb-2">{{$t('market')}}</p>
                                <p class="mb-3">
                                    {{merchant.name}}
                                </p>
                                <p class="text-muted text-small mb-2">{{$t('address')}}</p>
                                <p class="mb-3">{{merchant.address}}</p>
                                <p class="text-muted text-small mb-2">{{$t('email')}}</p>
                                <p class="mb-3">{{merchant.email}}</p>
                                 <p class="text-muted text-small mb-2">{{$t('phone')}}</p>
                                <p class="mb-3">{{merchant.phone}}</p>
                                 <p class="text-muted text-small mb-2">{{$t('total order')}}</p>
                                <p class="mb-3">{{merchant.orders}}</p>
                            </b-card-body>
                        </b-card>
                    </b-colxx>
                    <b-colxx xxs="12" lg="8" xl="9" class="col-right">
                        <b-card class="mb-4">
                            <h1>Incoming Order</h1>
                            <!-- <b-button size="sm" @click="selectAllRows">Select all</b-button> -->
                            <div class="border-bottom pt-4 mb-5"></div>

                             <b-table
                                ref="order"
                                class="vuetable"
                                sort-by="title" 
                                sort-desc.sync="false"
                                @row-selected="onRowSelected"
                                :single-select="singleSelect"
                                :per-page="perPage"
                                :select-mode="bootstrapTable.selectMode"
                                :current-page="currentPage"
                                selectedVariant="primary"
                                :fields="bootstrapTable.fields"
                                :items="dataProvider"
                                fixed="fixed"
                              >
                               <template v-slot:head(check)="check">
                                  <b-form-checkbox
                                    v-model="checkedAll"
                                    @change="selectAllRows(check)"
                                  />
                                </template>
                              <template v-slot:cell(check)="row">
                                <b-form-checkbox
                                  :id="row.item.id"
                                  @change="checkedOrder(row.item,row.index,$event)"
                                  :checked="statusChecked(row.item,row.index)"
                                />
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
                              
                              <b-button style="float:right" v-b-modal.modalright variant="success">{{ $t('assign driver') }}</b-button>
                              <!-- modal -->
                               <b-modal id="modalright" ref="modalright" :title="$t('Assign Driver')" modal-class="modal-right">
                                  <p class="text-muted text-small mb-2">{{$t('Pick Driver')}}</p>
                                  <v-select v-model="state.driver" :options="drivers"/>
                                  <br/>
                                  <!-- <p class="text-muted text-small mb-2">{{$t('Total Driver Package')}}</p>
                                  <p class="mb-3">
                                      20 Paket
                                  </p>                                   -->
                                  <br/>
                                  <p class="text-muted text-small mb-2">{{$t('Total Package')}}</p>
                                  <p class="mb-3">
                                      {{orderList.length}} Paket
                                  </p>    
                                  <template slot="modal-footer">
                                      <b-button variant="primary" @click="assignDriver('modalright')" class="mr-1">Assign</b-button>
                                      <!-- <b-button variant="secondary" @click="hideModal('modalright')">Cancel</b-button> -->
                                  </template>
                              </b-modal>
                        </b-card>
                    </b-colxx>
                </b-row>
            </b-tab>

            <b-tab :title="$t('History order')">
              <b-card class="mb-4">
                <h1>History Order</h1>
                <br/>
                <b-dropdown id="ddown1" :text="`${$t('status :')} ${status.label}`" variant="outline-dark" class="mr-1 float-md-left btn-group" size="xs">
                    <b-dropdown-item v-for="(status,index) in statusOptions" :key="index" @click="changeStatus(status)">{{ status.label }}</b-dropdown-item>
                </b-dropdown>
                <br/>
                <div class="border-bottom pt-4 mb-5"></div>
                  <b-table
                    ref="history"
                    class="vuetable"
                    sort-by="title" 
                    sort-desc.sync="false"
                    @row-selected="onRowSelected"
                    :single-select="singleSelect"
                    :per-page="historyPerPage"
                    :select-mode="historyTable.selectMode"
                    :current-page="historyCurrentPage"
                    selectedVariant="primary"
                    :fields="historyTable.fields"
                    :items="dataHistory"
                    fixed=""
                  >

                  </b-table>
                <b-pagination
                    size="sm"
                    align="center"
                    :total-rows="historyTotalRows"
                    :per-page="historyPerPage"
                    v-model="historyCurrentPage"
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
            </b-tab>
        </b-tabs>
    </b-colxx>
</b-row>
</template>

<script>
import SingleLightbox from "../../../../components/Pages/SingleLightbox";
import UserCardBasic from "../../../../components/Cards/UserCardBasic";
import { urlProd, urlDev, apiDev } from '../../../../constants/config'
import axios from 'axios'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import VuetablePaginationBootstrap from '../../../../components/Common/VuetablePaginationBootstrap'


export default {
    components: {
        'v-select' : vSelect,
        "single-lightbox": SingleLightbox,
        "user-card-basic": UserCardBasic,
        'vuetable' : Vuetable,
        'vuetable-pagination-bootstrap' : VuetablePaginationBootstrap
    },
    data() {
      return {
        singleSelect: false,
        merchant: {
          id : '',
          name : '',
          address : '',
          email: '',
          phone: '',
          ratting: '',
          orders : ''
        },
        state: {
          driver: ''
        },
        counter: 0,
        emptyList: [],
        drivers : [],
        orderList : [],
        checkedAll: false,
        search : "",
        statusOptions: [
          {
            column: 'assigned',
            label: 'assigned'
          },
          {
            column: 'done',
            label: 'done'
          },
        ],

        pageSizes: [10, 20, 50],
        currentPage: 1,
        status: 'done',
        totalRows: 0,
        all_page: 0,
        perPage: '',
        historyCurrentPage: 1,
        historyPerPage: 10,
        historyTotalRows: 0,
        historyAll_page: 0,
        driver: '',
        isSelectedAll: '',
        bootstrapTable: {
          selected: [],
          selectMode: 'multi',
          fields: [
            { key: 'check', label: 'check', sortable: false },
            { key: 'voucher_code_delivery', label: 'Voucher Code', sortable: false, sortDirection: 'desc', tdClass: 'list-item-heading' },
            { key: 'customer_name', label: 'Customer', sortable: false },
            // { key: 'merchant_phone_number', label: 'Phone', sortable: false },
            { key: 'created_at', label: 'Created At', sortable: false, formatter: (value) => { 
                  return value.substring(0, 19);
              } 
              },
            { key: 'destination_address', label: 'Address', sortable: false, size:'20px'},
          ]
        },
        historyTable: {
          selected: [],
          selectMode: 'multi',
          fields: [
            { key: 'voucher_code_delivery', label: 'Voucher Code', sortable: false, sortDirection: 'desc', tdClass: 'list-item-heading' },
            { key: 'driver_name', label: 'Driver Name', sortable: false },
            { key: 'customer_name', label: 'Customer', sortable: false },
            // { key: 'merchant_phone_number', label: 'Phone', sortable: false },
            { key: 'created_at', label: 'Created At', sortable: false, 
              formatter: (value) => { 
                  return value.substring(0, 19);
              } 
              },
            { key: 'destination_address', label: 'Address', sortable: false, size:'20px'},
            { key: 'order_status_name', label: 'Status', sortable: false, size:'20px'},

          ]
        }
      }
    },

    mounted(){
      const merchant_id = JSON.parse(localStorage.getItem('id_merchant'))
      // console.log('merhcant id', this.merchant.id)
      const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
      const driver_id = JSON.parse(localStorage.getItem('driver_id'))
      let promise = axios.get(apiDev + `/api/bank-dki/v1/drivers?&merchant_id=${merchant_id}`, {headers:auth})
      let arr = []
      return promise
        .then(result => result.data)
        .then((data) => {   
          const items = data.data
          for (var i=0; i < items.length; i++){
                  arr.push({
                  value : items[i].driver_id,
                  label : items[i].name
          })
          }
          this.drivers = arr
          console.log(this.drivers)
        }).catch(_error => {
              return _error
        })
    }, 
    methods: {
      selectAllRows(check) {
        this.statusChecked();
      },

      changeStatus(status) {
        this.status = status;
        this.$refs.history.refresh();
        return status
      },

      changeFilter(status) {
        this.status = status;
      return status
      },

      statusChecked(item,index,e) {
        const empty = []
        if(this.checkedAll){
          if (item != null){
            this.orderList[index] = item.id
            console.log('state', this.orderList)
          }
          return true;
        } else if (this.orderList.length == 10){
          for( var i = 1; i <= 10 ; i++){
            console.log('length', this.counter)
            this.orderList.splice(index, 1)
            this.counter = this.counter + 1
            console.log('titit', this.orderList)
          }
          this.counter = 0
          return false;
        }
      },
      
      onRowSelected(items) {
        this.orderList = items
      },
      
      changePageSize(perPage) {
        this.perPage = perPage;
      return perPage
      },
      
      rowSelected (items) {
        this.bootstrapTable.selected = items
      },

      dataHistory (ctx) {
        const merchantId = JSON.parse(localStorage.getItem('id_merchant'))
        let current = this.historyCurrentPage
        let size = this.historyPerPage
        let status = this.status.label
        console.log ('status',status);
        const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
        let promise = axios.get(apiDev + `/api/bank-dki/v1/orders?merchant_id=${merchantId}&page=${current}&status=${status}`, {headers:auth})
        return promise

          .then(result => result.data)
          .then((data) => {
            this.historyCurrentPage = data.meta.current_page
            this.historyPerPage = data.meta.per_page
            this.historyTotalRows = data.meta.count
            this.historyAll_page = data.meta.total_pages
            const items = data.data
            console.log('test',data.data)
            return items;
          }).catch(_error => {
            return []
          })

      },

      dataProvider (ctx) {
        const merchantId = JSON.parse(localStorage.getItem('id_merchant'))
        console.log('set item', JSON.parse(localStorage.getItem('id_merchant')))
        let current = this.currentPage
        let size = this.perPage
        const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
        let promise = axios.get(apiDev + `/api/bank-dki/v1/orders/incoming/merchant-${merchantId}?page=${current}`, {headers:auth})
        return promise

          .then(result => result.data)
          .then((data) => {
            // console.log('test', data)
            this.currentPage = data.meta.current_page
            this.perPage = data.meta.per_page
            this.totalRows = data.meta.count
            this.all_page = data.meta.total_pages
            this.merchant.id = data.data.merchant.id
            // console.log('', this.merchant.id)
            this.merchant.name = data.data.merchant.merchant_name
            this.merchant.address = data.data.merchant.address
            this.merchant.orders = data.meta.count
            const items = data.data.orders
            return items;
          }).catch(_error => {
            return []
          })
      },

      makeToast(type){
        let variant
        let toaster
        let msg 
        let body
        if(type == "send"){
          variant = "success"
          toaster = "b-toaster-bottom-right"
          msg   = "Data has been sended"
          body = "Data sended succefuly"
        }
        if(type == "delete"){
          variant = "danger"
          toaster = "b-toaster-bottom-right"
          msg   = "Data has been deleted"
          body = "status succes"
        }
        if(type == "update"){
          variant = "warning"
          toaster = "b-toaster-bottom-right"
          msg = "Data has been updated"
          body = "Data updated succesfully"
        }
        this.$bvToast.toast(' ', {
        title: msg,
        variant: variant,
        toaster : toaster,
        solid: true
      })
    },

    assignDriver (refname) {
      const merchantId = JSON.parse(localStorage.getItem('id_merchant'))
      let body = {
          driver_id : this.state.driver.value,
          orders : this.orderList
      }
      // console.log('body', body)
      const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
      let promise = axios.post(apiDev + `/api/bank-dki/v1/orders/incoming/merchant-${merchantId}/assign`, body, {headers:auth} )
      return promise
      .then(res =>{
        //this.$refs.order.refresh()
        this.makeToast('send')
        window.location.reload()
        this.$refs[refname].hide()

      }).catch(err => {
      //alert(err)
      })  
    },

    checkedOrder(item,index,e){
        if(e){
          this.orderList[index] = item.id
        }else{
          this.orderList.splice(index, 1)
        }
        console.log('order list', this.orderList)
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
    
    hideModal (refname) {
      this.$refs[refname].hide()
      console.log('hide modal:: ' + refname)

      if (refname === 'modalnestedinline') {
        this.$refs['modalnested'].show()
      }
    },
    
    searchData(){
      console.log('cari', this.search)
        this.$refs.order.refresh();
    },
  }
}

</script>
