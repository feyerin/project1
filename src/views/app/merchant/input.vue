<template>
<div>
  <b-row>
    <b-colxx xxs="12">
        <piaf-breadcrumb :heading="$t('Tambah Merchant')" />
        <div class="separator mb-5"></div>
    </b-colxx>
  </b-row>
    <b-row>
    <b-colxx xxs="12">
        <b-card class="mb-4" :title="$t('table.inputMerchant')">
          <b-form @submit.prevent="onGridFormSubmit">
            <b-row>

              <b-colxx sm="12">
                <b-form-group label-cols="2" :label="$t('forms.namaPemilik')">
                  <b-form-input v-model="state.ownerName" />
                </b-form-group>
              </b-colxx>
              
              <b-colxx sm="12">
                <b-form-group horizontal label-cols="2" breakpoint="sm" :label="$t('Alamat Pemilik')">
                  <b-textarea v-model="state.ownerAddress" :rows="4" :max-rows="4" />
                </b-form-group>
              </b-colxx>


               <b-colxx sm="12">
                <b-form-group label-cols="2" horizontal :label="$t('Email Pemilik ')">
                  <b-form-input type="email" v-model="state.ownerEmail" />
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group label-cols="2" horizontal :label="$t('forms.NomorHP')">
                  <b-form-input v-model="state.ownerPhone"  :placeholder="$t('ex. +6281xxxxxxxxx')"/>
                </b-form-group>
              </b-colxx>
              
              <b-colxx sm="12">
                <b-form-group label-cols="2" horizontal :label="$t('forms.IDPemilik')">
                  <b-form-input v-model="state.ktp" />
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group label-cols="2" horizontal :label="$t('Foto KTP')">
                    <b-form-file v-model="state.ktpImage" :placeholder="$t('Choose a file..')"></b-form-file>
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group label-cols="2" horizontal :label="$t('Tipe Pemilik')">
                  <v-select v-model="state.ownerType" :options="selectData"/>
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group horizontal label-cols="2" breakpoint="sm" :label="$t('Bank')">
                    <b-row>
                        <b-colxx sm="6">
                            <b-form-group :label="$t('Bank')">
                              <b-form-input v-model="state.accountName" />
                            </b-form-group>
                        </b-colxx>
                        <b-colxx sm="6">
                            <b-form-group :label="$t('No. Rekening')">
                                <b-form-input v-model="state.accountNumber" />
                            </b-form-group>
                        </b-colxx>
                    </b-row>
                    <b-row>
                        <b-colxx sm="6">
                            <b-form-group :label="$t('Kode Rekening')">
                                <b-form-input v-model="state.accountCode" />
                            </b-form-group>
                        </b-colxx>
                        <b-colxx sm="6">
                            <b-form-group :label="$t('Buku Rekening')">
                                <b-form-file v-model="state.bookImage"  :placeholder="$t('Choose a file..')"></b-form-file>
                            </b-form-group>
                        </b-colxx>
                    </b-row>
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group label-cols="2" horizontal :label="$t('forms.NamaUsaha')">
                  <b-form-input v-model="state.merchantName" ></b-form-input>
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group label-cols="2" horizontal :label="$t('No. Telepon Usaha')">
                  <b-form-input v-model="state.mechantPhone" :placeholder="$t('ex. +6281xxxxxxxxx')" />
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group label-cols="2" horizontal :label="$t('forms.AlamatEmail')">
                  <b-form-input type="email" v-model="state.merchantEmail" ></b-form-input>
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group label-cols="2" horizontal :label="$t('Posisi Merchant')">
                    <b-row>
                        <b-colxx sm="6">
                            <b-form-group :label="$t('Latitude')">
                                <b-form-input v-model="state.lat" ></b-form-input>
                            </b-form-group>
                        </b-colxx>
                        <b-colxx sm="6">
                            <b-form-group :label="$t('Longtitude')">
                                <b-form-input v-model="state.lon" ></b-form-input>
                            </b-form-group>
                        </b-colxx>
                    </b-row>
                    <!-- <b-row>
                        <b-colxx sm="6">
                            <b-form-group :label="$t('Start Time')">
                                <b-form-timepicker v-model="state.timeStart" placeholder="Choose a time" local="en"></b-form-timepicker>
                            </b-form-group>
                        </b-colxx>
                        <b-colxx sm="6">
                            <b-form-group :label="$t('End Time')">
                                <b-form-timepicker v-model="state.timeEnd" placeholder="Choose a time" local="en"></b-form-timepicker>
                            </b-form-group>
                        </b-colxx>
                    </b-row> -->
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group horizontal label-cols="2" breakpoint="sm" :label="$t('Alamat Merchant')">
                  <b-textarea v-model="state.merchantAddress" :rows="4" :max-rows="4" />
                </b-form-group>
              </b-colxx>

              <b-colxx sm="12">
                <b-form-group horizontal label-cols="2" breakpoint="sm" :label="$t('Deskripsi')">
                  <b-textarea v-model="state.desc" :rows="4" :max-rows="4" />
                </b-form-group>
              </b-colxx>
            </b-row>

            <b-button type="submit" variant="primary" @click="sendData()" class="mt-4 float-right" >{{ $t('Submit') }}</b-button>
          </b-form>
        </b-card>
    </b-colxx>
  </b-row>
</div>
</template>


<script>
import axios from 'axios'
import InputTag from '../../../components/Form/InputTag'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { urlProd, urlDev } from '../../../constants/config'



export default {
  components: {
    'input-tag' : InputTag,
    'v-select' : vSelect

  },
  data() {
      return {
          state: [{
            ownerName: '',
            ownerAddress: '',
            ownerPhone: '',
            ownerEmail: '',
            ktp: '',
            ktpImage: '',
            ownerType: '',
            merchantName: '',
            merchantAddress: '',
            merchantPhone: '',
            merchantEmail: '',
            lat: '',
            lon: '',
            desc: '',
            accountNumber: '',
            accountName: '',
            accountCode: '',
            bookImage: ''
          }],
         selectData: [
            { label: 'PKP', value: '1' },
            { label: 'Non-PKP', value: '2' },
        ],
      }
  },
  methods: {
    onGridFormSubmit() {

    },
    async sendData(){   
            const body = {
              owner: {
                name: this.state.ownerName, 
                address : this.state.ownerAddress,
                phone : this.state.ownerPhone,
                email : this.state.ownerEmail,
                ktp : this.state.ktp,
                ktp_image : this.state.ktpImage.name,
                owner_type: this.state.ownerType,
              },
              merchant: {
                name : this.state.merchantName,
                email : this.state.merchantEmail,
                address : this.state.mechantAddress,
                trip_type : this.$route.params.status,
                lat : this.state.lat,
                lon : this.state.lon,
                phone: this.state.merchantPhone,
                desc: this.state.desc,
              },
              bank_account: {
                account_code : this.state.accountCode,
                account_name : this.state.accountName,
                account_number : this.state.accountNumber,
                account_image : this.state.bookImage.name
              }
            }
            console.log("body", body)
            const auth = {'Authorization' : 'Bearer ' + JSON.parse(localStorage.getItem('user')).token}
            let promise = axios.post(urlProd +'/api/v1/acquisition/dashboard/insert', body  )
            return promise
            .then(res => {
              window.location ="/app/merchant/merchant"
              console.log("res :",res)
            }).catch(err => {
            alert(err)
            })  
    },
  }
}

</script>