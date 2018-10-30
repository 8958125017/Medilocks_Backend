var async = require('async');
var CONST = require('../config/constants');
var multichain = CONST.multichainConn;
var cloudinary = require('cloudinary');
var base64Img = require('base64-img');
const base64 = require('base64topdf');
var fs = require('fs');

cloudinary.config({
  cloud_name: "dki8mtnah",
  api_key: "198791337598694",
  api_secret: "TieGxyKuvmwVNkxwJ1Y_vLxvMLw"
});




var  fileUpload = function(data,callback){
var filepath = base64Img.imgSync(data,'./profile_images/'+"profile");
console.log("filePath",filepath);
cloudinary.uploader.upload(filepath, function(result) {
               if (result) {
                 console.log("result",result);
                   // fs.unlinkSync(filepath);
                   callback(result.url);


               }
           })
       }





var getNewAddressandpermissionOnMultichain = async (callback)=>{
  console.log("result----------------------");
    multichain.getNewAddress((err, result) => {
        console.log("erroe--------------",err + result);
        if (err) callback(null)
        else {
            var counter = 0;
            var permissions = ['send', 'receive', 'connect', 'mine', 'admin', 'activate', 'issue', 'create'];
            async.forEachLimit(permissions, 1, (element, next) => {
                multichain.grant({
                    'addresses': result,
                    'permissions': element
                }, (err, resp) => {
                    if (err) callback(null);
                    else {
                        counter++;
                        if (counter != permissions.length)
                        next();
                        else  callback(result);
                    }
                })
            });

        }
    })
}
var liststreamskey = (data,callback)=>{
  console.log("fundata",data);
    multichain.listStreamKeyItems({
      stream: data.stream,
      key:data.key,
      count: 25
        },
        (err, result) => {
        if (err) callback(null)
        else {
          if(result.length){
            var resultLength = result[result.length-1].data;
            console.log("resultlength",resultLength);
            var value = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
            console.log("value",JSON.stringify(value));
            callback(value);
          }else{
            callback(null)
          }
}
})
}

var listStreamPublisherItems = (data,callback)=>{
      multichain.listStreamPublisherItems({
      stream: data.stream,
      address:data.address,
      count: 25
          },(err, result) => {
            console.log("result----------------",result);
        if (err) callback(null)
        else {
          if(result){
            let counter = 0;
            var responseData = [];
            async.forEachLimit(result, 1, (element, next) => {
                counter++;
                if(counter < result.length){
                  var resultLength = result[counter-1].data;
                  var value = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
                  responseData.push(value);
                  next()
                }else{
                  var resultLength = result[counter-1].data;
                  var value = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
                  responseData.push(value);
                  callback(responseData);
                }
              });
          }else{
            callback(null);
          }
         }
      });
}

var listStreamKeyIteam= (data,callback)=>{
    multichain.listStreamKeyItems({
      stream: data.stream,
      key:data.aadharNo,
      count: 25
        },
        (err, result) => {
          callback(err)
        if (err) callback(null)
        else {
          if(result){''
            let counter = 0;
            var responseData = [];
            async.forEachLimit(result, 1, (element, next) => {
                counter++;
                if(counter < result.length){
                  var resultLength = result[counter-1].data;
                  var value = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
                  if(value.stream && value.key){
                    multichain.listStreamItems({ stream: value.stream ,key : value.key,count:20},
                        (err, result1) => {
                            responseData.push({data : value.hash,uploadedby :JSON.parse(Buffer(result1[result1.length-1].data,'hex').toString('utf8'))});
                            next();
                        })
                  }else{
                    next();
                  }
                }else{
                  var resultLength = result[counter-1].data;
                  var value = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
                  if(value.stream && value.key){
                    multichain.listStreamItems({ stream: value.stream ,key : value.key,count:20},
                        (err, result1) => {
                            responseData.push({data : value.hash,uploadedby :JSON.parse(Buffer(result1[result1.length-1].data,'hex').toString('utf8'))});
                            callback(responseData);
                        })
                  }else{
                    callback(responseData);
                  }

                }
              });
            // var resultLength = result[result.length-1].data;
            // var value = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
            // console.log(value);
               // callback(value);
          }
    }
})
}

var listPublisherStreamKeys = (data,callback)=>{
  console.log(data);
  var arr = [];
    multichain.listStreamPublisherItems({
      address : data.address,
      stream: data.stream,
      verbose : true,
      count: 25
        },
        (err, result) => {
  //         callback(err)
  //       if (err) callback(null)
  //       else {
  //         if(result){
  //           let counter = 0;
  //           var secondResult = result;
  //
  //          async.forEachLimit(secondResult, 1, (element, next) => {
  //              counter++;
  //              console.log('secondResult.lengthsecondResult.length',secondResult.length,counter);
  //              if (counter > secondResult.length) {
  //                var data1 = element.data;
  //                var result1 = hexTodata(data1);
  //                arr.push(result1);
  //                console.log('dsdadlajhsdhad',arr)
  //                callback(arr);
  //         }else {
  //           var data2 = element.data;
  //           // var data = hexTodata(data);
  //             var result1 = JSON.parse(Buffer(data2,'hex').toString('utf8'));
  //           arr.push(result1);
  //            // console.log('dsdadlajhsdhad',arr)
  //           next()
  //         }
  //         // callback(null)
  //       })
  //     }
  //   }
  // })
  let counter = 0;
  var responseData = [];
  console.log("results||||||||||||",result);
  async.forEachLimit(result, 1, (element, next) => {
      counter++;
      if(counter < result.length){
        var resultLength = result[counter-1].data;
        var value = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
        responseData.push(value);
        next();
      }else{
        var resultLength = result[counter-1].data;
        var value = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
        responseData.push(value);
        callback(responseData);
      }
    });
})
}


function hexTodata(data){
  var value = JSON.parse(Buffer(data,'hex').toString('utf8'));
return value;
}


var publishDataOnMultichain = (publishData,callback)=>{
  console.log("data",publishData);
    if (!publishData) {
        return res.send({
            status: 400,
            message: "Please insert a data and key in the POST body to publish."
        });
    } else {

        multichain.publishFrom({
                from: publishData.address,
                stream: publishData.streamName,
                key: publishData.key,
                data: publishData.data
            },
            (err, result) => {
                if (err) {
                    console.log("error" + JSON.stringify(err));
                    callback(err);
                }
                console.log('callback come::', result, err);
                callback(result);
                // return res.send({status : 200, message : "Data has been saved!", result : result});
            });
    };
}


var listStreamKey= (data,callback)=>{
  console.log("data",data);
    multichain.listStreamKeyItems({
      stream: data.stream,
      key:data.aadharNo,
      count: 99999
        },
        (err, result) => {
          console.log("element---------------------",result);

        if (err) callback(null)
        else {
            let counter = 0;
            var responseData = [];
            async.forEachLimit(result, 1, (element, next) => {
              // console.log("element",element);
                counter++;
                if(counter < result.length){
                  var resultLength = result[counter-1].data;
                  var value = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
                  responseData.push(value);
                  next();
                }else{
                  var resultLength = result[counter-1].data;
                  var value = JSON.parse(Buffer(resultLength,'hex').toString('utf8'));
                  responseData.push(value);
                  callback(responseData);
                }
              });
              // callback(value);
          }
})


}


exports.getNewAddressandpermissionOnMultichain = getNewAddressandpermissionOnMultichain;
exports.publishDataOnMultichain = publishDataOnMultichain;
exports.liststreamskey = liststreamskey;
exports.listPublisherStreamKeys = listPublisherStreamKeys;
exports.listStreamKeyIteam = listStreamKeyIteam;
exports.listStreamPublisherItems = listStreamPublisherItems;
exports.listStreamKey = listStreamKey;
exports.fileUpload =fileUpload;
