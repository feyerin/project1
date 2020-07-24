import axios from 'axios';
import { apiUrl, apiDev } from '../constants/config';
let promise = axios.get(apiDev + '/api/bank-dki/v1/drivers?status=&merchant_id=62db76b6-d240-40df-8064-8816e6735feb')
let arr = []
promise
    .then(result => result.data)
    .then((data) => {   
      const items = data.data.content
      for (var i=0; i < items.length; i++){
          if(items[i].province_name != null){
              arr.push({
              value : items[i].id,
              label : items[i].province_name
            })
          }
      }
      this.province = arr
    }).catch(_error => {
      return _error
    })

const province = arr
export default province