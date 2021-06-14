const functions = require("firebase-functions");
const podcastFeedParser = require("podcast-feed-parser");
const admin = require("firebase-admin");

admin.initializeApp();

function handleCorsResponse(req, res, callback) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', '*');
    res.set('Access-Control-Allow-Headers', "*")
    //res.set('Access-Control-Allow-Headers', 'Authorization');
    //res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    callback()
  }
}

exports.refresh = functions.https.onRequest((request, response)=>{
  handleCorsResponse(request, response, ()=>{
    const channels = request.body.data.channels;
    const database = admin.database().ref("channels");
    const results = [];
    database.get().then((snapshot)=>{
      const allChannels = snapshot.val();
      for (const key of channels) {
        if (allChannels[key]) {
          podcastFeedParser.getPodcastFromURL(allChannels[key].url).then((podcast)=>{
            results.push(podcast);
            database.child(key).set({
              url: allChannels[key].url,
              ...JSON.parse(JSON.stringify(podcast)),
            }).then(()=>{
              if (results.length === channels.length) {
                response.setHeader("Content-Type", "application/json");
                response.status(200).send(JSON.stringify({
                  channels: results,
                }));
              }
            });
          }).catch((error)=>{
            response.status(404).send(JSON.stringify(error));
          });
        }
      }
    });
  })
});

exports.add = functions.https.onRequest((request, response)=>{
  handleCorsResponse(request, response, ()=>{
    const ref = admin.database().ref("channels");
    const childRef = ref.push();
    console.log(request.body.data)
    const url = request.body.data.url;
    podcastFeedParser.getPodcastFromURL(url).then((podcast)=>{
      functions.logger.log("parsePodcast", podcast.title);
      childRef.set({
        url,
        ...JSON.parse(JSON.stringify(podcast)),
      }).then(()=>{
        const result = {};
        result[childRef.key] = podcast;
        response.setHeader("Content-Type", "application/json");
        response.status(200).send(JSON.stringify(result));
      });
    }).catch(()=>{
      response.status(400).send("bad");
    });
  })
});
