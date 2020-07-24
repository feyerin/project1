<template>
<div>
  <b-row>
    <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('approval merchant')" />
        <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
  <b-row>
    <b-colxx xxs="12">
      <b-card class="mb-4" :title="$t('table.approval')">
        <div class="mb-2 mt-2">
              <b-row>
                    <b-colxx >
                      <div class="d-block d-md-inline-block pt-1">
                          <b-dropdown id="ddown1" :text="`${$t('pages.orderby')} ${sort.label}`" variant="outline-dark" class="mr-1 float-md-left btn-group" size="xs">
                              <b-dropdown-item v-for="(order,index) in sortOptions" :key="index" @click="changeOrderBy(order)">{{ order.label }}</b-dropdown-item>
                          </b-dropdown>
                          <b-dropdown id="ddown1" :text="`${$t('status :')} ${status.column}`" variant="outline-dark" class="mr-1 float-md-left btn-group" size="xs">
                              <b-dropdown-item v-for="(status,index) in statusOptions" :key="index" @click="changeStatus(status)">{{ status.label }}</b-dropdown-item>
                          </b-dropdown>
                          <b-row class="mb-5">
                            <b-colxx xxs="6" class="custom-css">
                                <v-date-picker mode="range" v-model="selectedValueRange" @click="changeDateRange(selectedValueRange)"></v-date-picker>
                            </b-colxx>
                          </b-row>
                         
                      </div>
                    </b-colxx>
                    <b-colxx>
                       <div class="float-md-right pt-1">
                         <div class="search-sm d-inline-block float-md-left mr-1 align-top">
                                <b-input :placeholder="$t('menu.search')" v-model="search" @change="searchData()"/>
                            </div>
                            <span class="text-muted text-small mr-1 mb-2">{{currentPage}} of {{ allPage }}</span>
                            <b-dropdown id="ddown2" right :text="`${perPage}`" variant="outline-dark" class="d-inline-block" size="xs">
                                <b-dropdown-item v-for="(size,index) in pageSizes" :key="index" @click="changePageSize(size)">{{ size }}</b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </b-colxx>
                </b-row>
            </div>
        <b-table
            ref="approval"
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
          <template v-slot:cell(owner_type)="row">
            <div disabled v-if="(row.item.owner_type == 0 )" class="mr-1 float-md-left btn-group" size="xs">
                NON-PKP
              </div>
              <div disabled v-if="(row.item.owner_type == 1 )" class="mr-1 float-md-left btn-group" size="xs">
                PKP
              </div>
          </template>
          <template v-slot:cell(status)="row">
              <b-badge pill v-if="(row.item.status == 'being proccessed' )" variant="outline-info" class="mr-1 float-md-left" size="xs">
                Waiting
              </b-badge>
              <b-badge disabled v-if="(row.item.status == 'accepted' )" variant="outline-success" class="mr-1 float-md-left" size="xs">
                Approved
              </b-badge>
              <b-badge disabled v-if="(row.item.status >= 'rejected')" variant="outline-danger" class="mr-1 float-md-left" size="xs">
                Rejected
              </b-badge> 
          </template>
         <template v-slot:cell(actions)="row">
              <b-button v-b-tooltip.hover title="Preview" @click="preview(row.item, row.index,$event.target)" variant="secondary" class="mr-1 float-md-left btn-group" size="xs">
                <i class="simple-icon-eye"></i>
              </b-button>
              
              <b-button v-b-tooltip.hover title="Approve" v-if="(row.item.status === 'being proccessed' )" @click="approve(row.item, row.index,$event.target)" variant="success" class="mr-1 float-md-left btn-group" size="xs">
                <i class="simple-icon-check"></i>
              </b-button>
              <b-button v-b-tooltip.hover title="Reject" v-if="(row.item.status === 'being proccessed' )" @click="reject(row.item, row.index,$event.target, 'error')" variant="danger" class="mr-1 float-md-left btn-group" size="xs">
                <i class="simple-icon-close"></i>
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
              <!-- <b-form-group label-cols="2" horizontal :label="$t('Tax Image')">
                <div class="mt-2 ml-5">:
                  <b-button v-b-modal.modallg1  variant="outline-primary" size="xs" class="mr-2 mb-2">{{ $t('preview') }}</b-button> 
                  <b-modal id="modallg1" size="lg" hide-footer>
                    <img v-bind:src="infoModalPreview.content.company_tax_image" style="width:100%"/>
                  </b-modal>
                </div>
              </b-form-group> -->
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
            <h1>Merchant</h1>
            <b-row>
              <b-colxx sm="6">
                <b-form-group  label-cols="2" :label="$t('Name')">
                  <div v-if="( infoModalPreview.content.merchants != undefined )" class="mt-2 ml-5">: {{infoModalPreview.content.merchants[0].merchant_name}}</div>
                </b-form-group>
                <b-form-group label-cols="2" :label="$t('Address')">
                  <div v-if="( infoModalPreview.content.merchants != undefined )" class="mt-2 ml-5">: {{infoModalPreview.content.merchants[0].address}}</div>
                </b-form-group>
              </b-colxx>
              
              <b-colxx sm="6">
                <b-form-group label-cols="2" horizontal :label="$t('Email Address')">
                  <div v-if="( infoModalPreview.content.merchants != undefined )" class="mt-2 ml-5">: {{infoModalPreview.content.merchants[0].email_address}}</div>
                </b-form-group>
                <b-form-group label-cols="2" horizontal :label="$t('Phone Number')">
                  <div v-if="( infoModalPreview.content.merchants != undefined )" class="mt-2 ml-5">: {{infoModalPreview.content.merchants[0].merchant_phone_number}}</div>
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
      search : "",
      infoModalPreview: {
          id: 'info-modal-preview',
          title: '',
          content: ''
      },
      sort: {
              column: 'title',
              label: 'Newest'
            },
      sortOptions: [
          {
              column: 'newest',
              label: 'Newest'
          },
          {
              column: 'lastest',
              label: 'Lastest'
          },
        ],

      status: {
              column: 'being proccessed',
              label: 'being proccessed'
            },
      statusOptions: [
        {
            column: 'being proccessed',
            label: 'being proccessed'
        },
        {
            column: 'accepted',
            label: 'accepted'
        },
        {
            column: 'rejected',
            label: 'rejected'
        },
      ],
      selectedValueRange: {
          start: new Date(2020, 1, 18),
          end: new Date(2020, 1, 18)
      },
      pageSizes: [10, 20, 50],
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      allPage: 0,
      bootstrapTable: {
        selected: [],
        selectMode: 'multi',
        fields: [
          { key: 'company_name', label: 'Company Name', sortable: false, sortDirection: 'desc', tdClass: 'list-item-heading' },
          { key: 'owner_type', label: 'Company Type', sortable: false,  },
          { key: 'company_phone_number', label: 'Company Phone', sortable: false,  },
          { key: 'owner_name', label: 'Owner Name', sortable: false },
          { key: 'owner_phone_number', label: 'Owner Phone', sortable: false },
          { key: 'created_at', label: 'Created At', sortable: false, formatter: (value) => { 
            return value.substring(0, 10);
           } },
          { key: 'status', label: 'Status', sortable: false },
          { key: 'actions', label: 'Actions', sortable: false }
        ]
      }
    }
  },
  methods: {
     approve(item,index,button,  
          type = 'success',
          title = 'Approved',
          message = 'Merchant Successfully Approved' ){
      const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
      let params = item.id
      let promise = axios.patch(urlDev + `/api/v1/acquisition/approval/accepted/${params}`, {}, {
        headers: {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
        }
      )
      return promise
        .then(res => {
          this.$refs.approval.refresh();
          this.$notify(type, title, message, { duration: 3000, permanent: false })

        },)    
    },
    preview(item,index,button){
      this.infoModalPreview.title = "Preview Data"
      this.infoModalPreview.content = item;
      this.$root.$emit('bv::show::modal', this.infoModalPreview.id, button)
    },
    reject(item,index,button,
          type = 'success',
          title = 'Rejected',
          message = 'Merchant Successfully Rejected' ){
      const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
      let params = item.id
      let promise = axios.patch(urlDev + `/api/v1/acquisition/approval/rejected/${params}`, {}, {
        headers: {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
        }
      )
      return promise
        .then(res => {
          this.$refs.approval.refresh();
          this.$notify(type, title, message, { duration: 3000, permanent: false })
        })
    },
    addNotification (
      type = 'success',
      title = 'This is Notify Title',
      message = 'This is Notify Message,<br>with html.'
    ) {
      this.$notify(type, title, message, { duration: 3000, permanent: false })
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
      let promise = axios.get(urlProd + `/api/v1/acquisition/dashboard/ownerDetail?pageSize=${size}&page=${current}&keyword=${this.search}&status=${'being proccessed'}`, {headers:auth})
      return promise
        .then(result => result.data)
        .then((data) => {
          console.log('callback', data)
          this.currentPage = current
          this.perPage = size
          this.totalRows = data.count
          this.allPage = data.all_page
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
    searchData(){
      console.log('cari', this.search)
        this.$refs.approval.refresh();
    },
    changeDateRange(){
      console.log('callback', this.selectedValueRange)
    },
    changeOrderBy(sort) {
      console.log(sort.label)
      this.sort = sort
    return sort
    },
    changeStatus(status) {
      this.status = status;
      this.$refs.approval.refresh();
      return status
    },
  }
}
</script>
