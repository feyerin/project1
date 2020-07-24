<template>
<b-row>
    <b-colxx xxs="12">
        <h1>Drivers Profile</h1>
        <piaf-breadcrumb />
        <b-tabs nav-class="separator-tabs ml-0 mb-5" content-class="tab-content" :no-fade="true">
            <b-tab :title="$t('profile')">
                <b-row>
                    <b-colxx xxs="12" class="mb-5">
                        <b-card>
                        </b-card>
                    </b-colxx>
                    <b-colxx xxs="12" lg="5" xl="4" class="col-left">
                        <b-card class="mb-4" no-body>
                            <b-card-body>
                                <div class="text-center pt-4">
                                    <!-- <single-lightbox thumb="/assets/img/profile-pic-l.jpg" large="/assets/img/profile-pic.jpg" class-name="img-thumbnail card-img social-profile-img" />
                                    <p class="list-item-heading pt-2">Sarah ardelia</p> -->
                                </div>
                                
                                <p class="text-muted text-small mb-2">{{$t('profile')}}</p>
                                <p class="mb-3">
                                    name    : {{driver.name}}                                   
                                </p>
                                <p class="mb-3">
                                    phone   : {{driver.phone}}
                                </p>
                                <p class="mb-3">
                                    email   : {{driver.email}}
                                </p>
                                <p class="mb-3">
                                    address : {{driver.address}}
                                </p>
                            </b-card-body>
                        </b-card>

                        <b-card class="mb-4" no-body>
                            <b-card-body>
                                <p class="text-muted text-small mb-2">{{$t('Asigned on :')}}</p>
                                <p> 
                                    {{driver.merchant.name}}
                                </p>
                                <p class="text-muted text-small mb-2">{{$t('Address :')}}</p>
                                <p> 
                                    {{driver.merchant.address}}
                                </p>
                                <p class="text-muted text-small mb-2">{{$t('Created At :')}}</p>
                                <p> 
                                    {{driver.merchant.created_at}}
                                </p>
                                <!-- <p class="text-muted text-small mb-2">{{$t('Rating :')}}</p>
                            
                                    <div class="mb-3">
                                        <stars value="driver.merchant.rating" :disabled=true></stars>
                                    </div> -->
                            

                            </b-card-body>
                        </b-card>
                    </b-colxx>
                    <b-colxx xxs="12" lg="7" xl="8" class="col-right">
                        <b-card class="mb-4">
                            <h2>Order</h2>
                            
                            <div class="border-bottom pt-4 mb-5"></div>

                            <b-table
                                ref="history"
                                 class="vuetable"
                                sort-by="title" 
                                sort-desc.sync="false"
                                :per-page="perPage"
                                :select-mode="bootstrapTable.selectMode"
                                :current-page="currentPage"
                                selectedVariant="primary"
                                :fields="bootstrapTable.fields"
                                :items="dataProvider"
                                fixed="fixed"
                            >
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
            </b-tab>

            <!-- <b-tab :title="$t('History order')">
               
            </b-tab> -->

            
        </b-tabs>
    </b-colxx>
</b-row>
</template>

<script>
import Stars from '../../../../components/Common/Stars'
import SingleLightbox from "../../../../components/Pages/SingleLightbox";
import UserCardBasic from "../../../../components/Cards/UserCardBasic";
import { urlProd, urlDev, apiDev } from '../../../../constants/config'
import axios from 'axios'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../../components/Common/VuetablePaginationBootstrap'


import produtcs from "../../../../data/products";
export default {
    components: {
        'stars': Stars,
        "single-lightbox": SingleLightbox,
        "user-card-basic": UserCardBasic,
        'vuetable' : Vuetable,
        'vuetable-pagination-bootstrap' : VuetablePaginationBootstrap
    },
    data() {
        return {
            driver: {
                driver_id: '',
                name :'',
                merchant : {
                    name: '',
                    address: '',
                    created_at: '',
                    rating:''
                },
                phone : '',
                address : '',
                email: ''
            },
            produtcs: produtcs.slice(0, 15),
            id : '',
            search : "",
            pageSizes: [10, 20, 50],
            currentPage: 2,
            perPage: 10,
            totalRows: 0,
            all_page: 0,
            bootstrapTable: {
                selected: [],
                selectMode: 'multi',
                fields: [
                { key: 'order_code', label: 'No Order', sortable: false, sortDirection: 'desc', tdClass: 'list-item-heading' },
                { key: 'merchant_name', label: 'Pasar', sortable: false },
                { key: 'customer_name', label: 'Customer', sortable: false },
                { key: 'destination_address', label: 'Address', sortable: false },
                { key: 'created_at', label: 'Created At', sortable: false, formatter: (value) => { 
                        return value.substring(0, 19);
                    } 
                },
                { key: 'order_status_name', label: 'status', sortable: false },

                ]
            },
        }
        },
        mounted(){
            const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
            const driver_id = JSON.parse(localStorage.getItem('driver_id'))
            let promise = axios.get(apiDev + `/api/bank-dki/v1/drivers/${driver_id}`, {headers:auth})
            let arr = []
            return promise
                .then(result => result.data)
                .then((data) => {   
                const items = data.data
                this.driver.driver_id = items.driver_id
                this.driver.name = items.name
                this.driver.phone = items.phone
                this.driver.email = items.email
                this.driver.address = items.address
                this.driver.merchant.name = items.merchant.merchant_name
                this.driver.merchant.address = items.merchant.address
                this.driver.merchant.created_at = items.merchant.created_at
                this.driver.merchant.rating = item.merchant.rating_summary
                console.log(items)
                }).catch(_error => {
                    return _error
                })
            },
        methods: {
        passingID(item) {
        this.id = item.id;
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
      const driver_id =  JSON.parse(localStorage.getItem('driver_id'))   
      console.log('driver id', driver_id)
      const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
      let promise = axios.get(apiDev + `/api/bank-dki/v1/orders?driver_id=${driver_id}&page=${current}&pageSize=${size}&search=${this.search}`, {headers:auth})
      return promise

        .then(result => result.data)
        .then((data) => {
          this.currentPage = data.meta.current_page
          this.perPage = data.meta.per_page
          this.totalRows = data.meta.count
          this.all_page = data.meta.toal_pages
          const items = data.data
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
    }
    }
}

</script>
