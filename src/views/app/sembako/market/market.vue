<template>
<div>
  <b-row>
    <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('Market')" />
        <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
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
                <b-colxx>
                    <div class="float-md-right pt-1">
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
        <template v-slot:cell(actions)="row">
            <router-link tag="a" class="float-lg-left" :to="{name:'detailMarket', params: { id: id }}">
              <b-button v-b-tooltip.hover title="Assign" @click="passingID(row.item)" variant="primary" size="xs"><i class="simple-icon-pencil"/></b-button>
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
            <!-- modal preview -->
          <b-modal :id="infoModalPreview.id" :title="infoModalPreview.title" size="lg" hide-footer>
            <h1>Company</h1>
            <b-row v-if="( infoModalPreview.content.owner_type != 0 )">
              <b-colxx sm="6">
                <b-form-group label-cols="2" :label="$t('Name')">
                  <div class="mt-2 ml-5">: {{infoModalPreview.content.company_name}}</div>
                </b-form-group>
                <b-form-group label-cols="2" :label="$t('Address')">
                  <div class="mt-2 ml-5">: {{infoModalPreview.content.company_address}}</div>
                </b-form-group>
                <b-form-group label-cols="2" horizontal :label="$t('Tax Number')">
                <div class="mt-2 ml-5">: {{infoModalPreview.content.company_tax_number}}</div>
              </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group label-cols="2" :label="$t('Email')">
                  <div class="mt-2 ml-5">: {{infoModalPreview.content.company_email_address}}</div>
                </b-form-group>
                <b-form-group label-cols="2" :label="$t('Phone Number')">
                  <div class="mt-2 ml-5">: {{infoModalPreview.content.company_phone_number}}</div>
                </b-form-group>
                <b-form-group label-cols="2" horizontal :label="$t('SIUP')">
                  <div class="mt-2 ml-5">: 
                    <b-button v-b-modal.modallg2  variant="outline-primary" size="xs" class="mr-2 mb-2">{{ $t('preview') }}</b-button>
                    <b-modal id="modallg2" size="lg" hide-footer>
                      <img v-bind:src="infoModalPreview.content.company_business_permit_image" style="width:100%"/>
                    </b-modal>
                  </div>
                </b-form-group>
                <b-form-group label-cols="2" horizontal :label="$t('Tax Number')">
                  <div class="mt-2 ml-5">: {{infoModalPreview.content.company_tax_number}}</div>
              </b-form-group>
              </b-colxx>
            </b-row>
            <h1>Owner</h1>
            <b-row>
              <b-colxx sm="6">
                <b-form-group label-cols="2" :label="$t('Name')">
                  <div class="mt-2 ml-5">: {{infoModalPreview.content.owner_name}}</div>
                </b-form-group>
                <b-form-group label-cols="2" :label="$t('Address')">
                  <div class="mt-2 ml-5">: {{infoModalPreview.content.owner_address}}</div>
                </b-form-group>
                <b-form-group label-cols="2" horizontal :label="$t('Phone Number')">
                <div class="mt-2 ml-5">: {{infoModalPreview.content.owner_phone_number}}</div>
                </b-form-group>
                <b-form-group label-cols="2" horizontal :label="$t('Email Address')">
                  <div class="mt-2 ml-5">: {{infoModalPreview.content.owner_email_address}}</div>
                </b-form-group>
                <b-form-group label-cols="2" :label="$t('KTP Number')">
                  <div class="mt-2 ml-5">: {{infoModalPreview.content.owner_ktp_number}}</div>
                </b-form-group>
              </b-colxx>
              <b-colxx sm="6">
                <b-form-group label-cols="2" :label="$t('KTP Image')">
                  <div class="mt-2 ml-5">: 
                    <b-button v-b-modal.modallg3  variant="outline-primary" size="xs" class="mr-2 mb-2">{{ $t('preview') }}</b-button>
                      <b-modal id="modallg3" size="lg" hide-footer>
                        <img v-bind:src="infoModalPreview.content.owner_ktp_image" style="width:100%"/>
                      </b-modal>
                  </div>
                </b-form-group>
                <b-form-group label-cols="2" horizontal :label="$t('Tax Number')">
                <div class="mt-2 ml-5">: {{infoModalPreview.content.owner_tax_number}}</div>
                </b-form-group>
                <b-form-group label-cols="2" horizontal :label="$t('Tax Image')">
                  <div class="mt-2 ml-5">: 
                    <b-button v-b-modal.modallg4  variant="outline-primary" size="xs" class="mr-2 mb-2">{{ $t('preview') }}</b-button>
                    <b-modal id="modallg4" size="lg" hide-footer>
                      <img v-bind:src="infoModalPreview.content.owner_tax_image" style="width:100%"/> 
                    </b-modal>
                  </div>
                </b-form-group>
              </b-colxx>
            </b-row>
          </b-modal>
      </b-card>
    </b-colxx>
  </b-row>
  </div>
</template>
<script>
import { urlProd, urlDev, apiUrl, apiDev } from '../../../../constants/config'
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
      id : '',
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
          { key: 'merchant_name', label: 'Merchant', sortable: false, sortDirection: 'desc', tdClass: 'list-item-heading' },
          { key: 'email_address', label: 'Email', sortable: false },
          { key: 'address', label: 'Address', sortable: false, size:'20px'},
          { key: 'merchant_phone_number', label: 'Phone', sortable: false },
          { key: 'created_at', label: 'Created At', sortable: false, formatter: (value) => { 
                return value.substring(0, 19);
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
        localStorage.setItem('id_merchant', JSON.stringify(this.id))   
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
      const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
      let promise = axios.get(apiDev + `/api/bank-dki/v1/merchants?page=${current}&limit=${size}&search=${this.search}`, {headers:auth})
      return promise

        .then(result => result.data)
        .then((data) => {
          
          const items = data.data
          //console.log('callback', items)
          this.currentPage = data.meta.current_page
          this.perPage = data.meta.per_page
          this.totalRows = data.meta.count
          this.all_page = data.meta.total_pages
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
