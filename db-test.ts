// import axios from "npm:axios";

// // const config = {
// //   method: "get",
// //   url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-jfidxqj/endpoint/data/v1/action/find",
// //   headers: {
// //     "Content-Type": "application/json",
// //     "Access-Control-Request-Headers": "*",
// //     "api-key":
// //       "TnuQD2j5mkTjjThtet3nS1YHLoUpArp4YBnssNLTOYGAjMi51vV81FXus7ulGwfI",
// //   },
// //   data: data,
// // };
// // axios(config)
// //   .then(function (response) {
// //     console.log(JSON.stringify(response.data));
// //   })
// //   .catch(function (error) {
// //     console.log(error);
// //   });
// const body = JSON.stringify({
//   collection: "Liquidations",
//   database: "Longs",
//   dataSource: "Binance",
//   projection: {
//     symbol: 1,
//   },
// });
// const resp = await fetch(
//   "https://eu-central-1.aws.data.mongodb-api.com/app/data-jfidxqj/endpoint/data/v1/action/find",
//   {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Access-Control-Request-Headers": "*",
//       "api-key":
//         "TnuQD2j5mkTjjThtet3nS1YHLoUpArp4YBnssNLTOYGAjMi51vV81FXus7ulGwfI",
//     },
//     body,
//   }
// );
// console.log(await resp.json());
