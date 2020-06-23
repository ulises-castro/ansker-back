import Device from 'models/device'

import firebaseAdmin from 'firebase'

export const suscribeUserToTopic = async (userId, topic) => {
  try {
    const findDevice = await Device.findOne({ userId }).lean().exec()

    if (!findDevice) return false

    const registrationTokens = [findDevice.token]

    const finalTopic = `/topics/${topic}`

    await firebaseAdmin.messaging().subscribeToTopic(registrationTokens, finalTopic)

    // See the MessagingTopicManagementResponse reference documentation
    // for the contents of response.
    console.log('Successfully subscribed to topic:', finalTopic, registrationTokens);

    return true
  } catch(e) {
    console.log(e)
    return false
  }
}

export const notifyNewComments = async (publicationId, isUserAuthor) => {
  const messages = []

  if (!isUserAuthor) {
    messages.push({
      notification: {title: 'New comment', body: 'Someone has commented on your publication.'},
      "collapse_key": `publication-${publicationId}`,
      topic: `user-publication-${publicationId}`,
      "webpush": {
        "headers": {
          "Urgency": "high"
        }
      }
    })
  }

  const choiceSubject = (!isUserAuthor) ? 'Someone' : 'Author'

  messages.push({
    notification: {
      title: 'New comment', body: `${choiceSubject} has commented on a publication that you commented as well.`}
    ,
    "collapse_key": `publication-${publicationId}`,
    topic: `publication-${publicationId}`,
    "webpush": {
      "headers": {
        "Urgency": "high"
      }
    }
  })

  firebaseAdmin.messaging().sendAll(messages)
  .then((response) => {
    console.log(response.successCount + ' messages were sent successfully')
  })

}

// Profile 
export const notifyProfilePublication = async (profileId, userName = false, isUserAuthor) => {
  const messages = []

  if (!isUserAuthor) {
    messages.push({
      notification: {title: 'New publication on your profile', body: 'Someone has publicated on your profile.'},
      "collapse_key": `profile-${profileId}`,
      topic: `user-profile-${profileId}`,
      "webpush": {
        "headers": {
          "Urgency": "high"
        }
      }
    })
  }

  firebaseAdmin.messaging().sendAll(messages)
  .then((response) => {
    console.log(response.successCount + ' messages were sent successfully')
  })

}

// QUESTIONS SECTION
export const notifyNewQuestions = async (publicationId, isUserAuthor) => {
  const messages = []


  if (!isUserAuthor) {
    messages.push({
      notification: {title: 'New comment', body: 'Someone has commented on your publication.'},
      "collapse_key": `publication-${publicationId}`,
      topic: `user-publication-${publicationId}`,
      "webpush": {
        "headers": {
          "Urgency": "high"
        }
      }
    })
  }

  messages.push({
    notification: {title: 'New comment', body: 'Someone has commented on a publication that you commented as well.'},
    "collapse_key": `publication-${publicationId}`,
    topic: `publication-${publicationId}`,
    "webpush": {
      "headers": {
        "Urgency": "high"
      }
    }
  })

  firebaseAdmin.messaging().sendAll(messages)
  .then((response) => {
    console.log(response.successCount + ' messages were sent successfully')
  })

}