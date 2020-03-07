import Config from './config';

class Api {
  constructor(host) {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    this.dateDefault = year + '-' + month + '-' + date;
    this.pageDefault = 0;
    this.sizeDefault = 5;
    this.host = host;
  }

  setToken(token) {
    this.token = token;
  }

  async fetchData(api, method, body) {
    try {
      const options = {
        method,
        headers: {
          Accept: 'application/json',
        },
        body
      }

      if (typeof body === 'string') {
        options.headers['Content-Type'] = 'application/json';
      }
      if (this.token) {
        options.headers['Authorization'] = this.token;
      }
      const response = await fetch(api, options);
      const json = await response.json();
      return { ...json, code: json.code, success: (json.code === 200 || json.code === 201) };
    }
    catch (err) {
      return { code: -1, errors: err, success: false };
    }
  }

  login(data) {
    const api = this.host + '/users/login';
    return this.fetchData(api, 'POST', JSON.stringify(data));
  }

  getRecords(page = 0, size = 10, status = "accepted", sort="desc",
             from=this.dateDefault,to=this.dateDefault) {
             //from='2019-09-01',to=this.dateDefault) {
             //from=this.dateDefault,to=this.dateDefault) {
    const api = this.host + `/records?page=${page}&size=${size}&status=${status}&from=${from}&to=${to}&sort=${sort}`;
    return this.fetchData(api);
  }
  getRecordsByReason(fromDate=this.dateDefault,toDate=this.dateDefault) {
    const api = this.host + `/aggregate/reasons?from=${fromDate}&to=${toDate}`;
    return this.fetchData(api);
  }

  getRecordsByDate(fromDay, toDay) {
    // console.log("FROM DATE",fromDay);
    // console.log('END DATE',toDay);
    const api = this.host + `/aggregate/days?from=${fromDay}&to=${toDay}&sort=asc`;
    return this.fetchData(api);
  }
  getRecordsByStatusDay(startDay,endDay){
    const api = this.host + `/aggregate/status?from=${startDay}&to=${endDay}`;
    // console.log("DOMAIN",api);
    return this.fetchData(api);
  }

  countRecordsByAddressId(id) {
    const api = this.host + `/records/count-records-by-address-id?id=${id}`;
    return this.fetchData(api);
  }

  countRecordsByReasonId(id) {
    const api = this.host + `/records/count-records-by-reason-id?id=${id}`;
    return this.fetchData(api);
  }

  countRecordsByPersonsharingId(id) {
    const api = this.host + `/records/count-records-by-personsharing-id?id=${id}`;
    return this.fetchData(api);
  }

  postRecords(data) {
    const api = this.host + '/records';
    return this.fetchData(api, 'POST', JSON.stringify(data));
  }

  updateStatusRecordsV2(userId, recordId, status, content = null) {
    let data = {
      userId,
      recordId,
      status,
      content
    };
    console.log("=========>api data: ",data);
    const api = this.host + `/records/switch-status`;
    return this.fetchData(api, 'PUT', JSON.stringify(data));
  }

  updatePriorityRecord(id) {
    let priority = true ;
    let data = {
      id,
      priority
    };
    const api = this.host + '/records/update-priority';
    return this.fetchData(api, 'PUT', JSON.stringify(data));
  }

  updateRecord(data) {
    const api = this.host + '/records/update';
    return this.fetchData(api, 'PUT', JSON.stringify(data));
  }

  updateAddress(data) {
    const api = this.host + '/addresses/update-address';
    return this.fetchData(api, 'PUT', JSON.stringify(data));
  }
  updateReason(data){
    const api = this.host + '/reasons/update-reason';
    return this.fetchData(api,'PUT',JSON.stringify(data));
  }

  updateSharer(data){
    const api = this.host + '/person-sharing/update-person-sharing';
    return this.fetchData(api,'PUT',JSON.stringify(data));
  }
  updateUser(data){
    const api = this.host + '/users/update';
    return this.fetchData(api,'PUT',JSON.stringify(data))
    
  }
  getReasons() {
    const api = this.host + '/reasons';
    return this.fetchData(api);
  }

  getReasonByName(name="Chưa%20rõ%20nguyên%20nhân") {
    const api = this.host + `/reasons/find?name=${name}`;
    return this.fetchData(api);
  }

  getSpeeds() {
    const api = this.host + '/speeds';
    return this.fetchData(api);
  }

  getPersonSharing() {
    const api = this.host + '/person-sharing';
    return this.fetchData(api);
  }

  createPersonSharing(data) {
    const api = this.host + '/person-sharing';
    return this.fetchData(api, 'POST', JSON.stringify(data));
  }

  createUser(data) {
    const api = this.host + '/users';
    return this.fetchData(api, 'POST', JSON.stringify(data));
  }

  getUser(page, size) {
    const api = this.host + `/users?page=${page}&size=${size}`;
    return this.fetchData(api);
  }
  
  getAddresses() {
    const api = this.host + '/addresses';
    return this.fetchData(api);
  }

  postAddress(data) {
    const api = this.host + '/addresses';
    return this.fetchData(api, 'POST', JSON.stringify(data));
  }

  createReason(data) {
    const api = this.host + '/reasons';
    return this.fetchData(api, "POST", JSON.stringify(data));
  }

  deleteRecord(id){
    const api = this.host + `/records/${id}`;
    return this.fetchData(api, 'DELETE');
  }

  deleteReason(id){
    const api = this.host + `/reasons/${id}`;
    return this.fetchData(api,'DELETE');
  }
  deletePersonSharing(id){
    const api = this.host +`/person-sharing/${id}`;
    return this.fetchData(api,'DELETE');
  }
  deleteAddress(id){
    const api = this.host +`/addresses/${id}`;
    return this.fetchData(api,'DELETE');
  }
  deleteUser(id){
    const api = this.host +`/users/${id}`;
    return this.fetchData(api,'DELETE');
  }
  getRecordForExport(fromDate,toDate){
    const api= this.host + `/records/export?from=${fromDate}&to=${toDate}`;
    return this.fetchData(api)
  }
  aggregateSpeedInPosition(fromDate,toDate,id){
    const api = this.host + `/addresses/aggregate/address-speed?id=${id}&from=${fromDate}&to=${toDate}`;
    return this.fetchData(api)
  }
  aggregateTopUTraffic(fromDate,toDate,reasonId,speedId){
    const api = this.host + `/addresses/aggregate/top-address-min-speed?speedId=${speedId}&from=${fromDate}&to=${toDate}
            &reasonId=${reasonId}`;
    return this.fetchData(api)
  }
  aggregateRecordByDateAndPosition(fromDate,toDate,id){
    const api = this.host +`/addresses/aggregate/address-day?id=${id}&from=${fromDate}&to=${toDate}`;
    return this.fetchData(api)
  }
  aggregateReasonByDateAnPosition(fromDate,toDate,id){
    const api = this.host +`/addresses/aggregate/address-reason?id=${id}&from=${fromDate}&to=${toDate}`;
    return this.fetchData(api)
  }
  sortBySpeed(speedId,fromDate=this.dateDefault,toDate=this.dateDefault,
              page=this.pageDefault,size=this.sizeDefault,status="accepted"){
    const api = this.host + `/records/speed?page=${page}&size=${size}&from=${fromDate}&to=${
      toDate}&speedId=${speedId}&status=${status}`;
    return this.fetchData(api)
  }
  sortByDistrict(district,fromDate=this.dateDefault,toDate=this.dateDefault,
                 page=this.pageDefault,size=this.sizeDefault,status="accepted"){
    const api = this.host +`/records/speed-and-district?page=${page}&size=${size}&from=${
      fromDate}&to=${toDate}&district=${district}&status=${status}`;
    return this.fetchData(api)
  }
  sortByDistrictAndSpeed(district,speedId,fromDate=this.dateDefault,toDate=this.dateDefault,
                         page=this.pageDefault,size=this.sizeDefault,status="accepted"){
    const api = this.host +`/records/speed-and-district?page=${page}&size=${size}&from=${
      fromDate}&to=${toDate}&district=${district}&speedId=${speedId}&status=${status}`;
    return this.fetchData(api)
  }
    
}

const api = new Api(Config.BACKEND_HOST);
export default api;