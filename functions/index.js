const functions = require("firebase-functions");
const podcastFeedParser = require("podcast-feed-parser");
const admin = require('firebase-admin');

admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/*exports.parsePodcast = functions.database.ref('/channels')
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    return new Promise(resolve => {
      let original = snapshot.toJSON(), url, key;
      original = JSON.parse(JSON.stringify(original))
      Object.keys(original).forEach(k=>{
        if (original[k].url) {
            key = k
            url = original[k].url
        }
      })
      if (url) {
        podcastFeedParser.getPodcastFromURL(url).then((podcast)=>{
          functions.logger.log('parsePodcast', podcast.title);
          admin.database().ref("channels").child(key).set({
              url,
              info: JSON.stringify(podcast)
          }, resolve)
        })
      } else {
        resolve(null)
      }
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    })
  });*/

exports.refresh = functions.https.onRequest((request, response)=>{
    const channels = JSON.parse(request.body).channels
    const database = admin.database().ref('channels')
    let results = []
    database.get().then(snapshot=>{
      let allChannels = snapshot.val()
      for (let key of channels) {
          if (allChannels[key]) {
              podcastFeedParser.getPodcastFromURL(allChannels[key].url).then(podcast=>{
                  results.push(podcast)
                  database.child(key).set({
                    url: allChannels[key].url,
                    ...JSON.parse(JSON.stringify(podcast))
                  }).then(()=>{
                    if (results.length === channels.length) {
                        response.setHeader('Content-Type', 'application/json')  
                        response.status(200).send(JSON.stringify({
                            channels: results
                        }))
                      } 
                  })
              }).catch((error)=>{
                  response.status(404).send(JSON.stringify(error))
              })
          }
        }
    })
})

exports.add = functions.https.onRequest((request, response)=>{
    var ref = admin.database().ref("channels");
    var childRef = ref.push();
    const url = request.body
    podcastFeedParser.getPodcastFromURL(url).then((podcast)=>{
        functions.logger.log('parsePodcast', podcast.title);
        childRef.set({
            url,
            ...JSON.parse(JSON.stringify(podcast))
         }).then(()=>{
             let result = {}
             result[childRef.key] = podcast
            response.setHeader('Content-Type', 'application/json')
            response.status(200).send(JSON.stringify(result)); 
         })
    }).catch(()=>{
        response.status(400).send('bad'); 
    })
})
