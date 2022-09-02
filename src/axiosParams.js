import axios from 'axios'
const params = { answer: 42 };

const res = await axios.get('https://httpbin.org/get', {
  params,
  paramsSerializer: function paramsSerializer(params) {
    // "Hide" the `answer` param
    return Object.entries(Object.assign({}, params,  { answer: 'HIDDEN' })).
      map(([key, value]) => `${key}=${value}`).
      join('&');
  }
});
console.log(res.data.args)