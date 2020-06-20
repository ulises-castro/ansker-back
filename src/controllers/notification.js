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
    console.log('Successfully subscribed to topic:', finalTopic);

    return true
  } catch(e) {
    console.log(e)
    return false
  }
}

export const notifyNewComments = async (publicationId) => {
  const messages = []

  messages.push({
    notification: {title: 'New comment', body: 'Someone has comment on your publication.'},
    topic: `user-publication-${publicationId}`,
  })

  messages.push({
    notification: {title: 'New comment', body: 'Someone has comment on a publication that you commented as well.'},
    topic: `publication-${publicationId}`,
  })

  firebaseAdmin.messaging().sendAll(messages)
  .then((response) => {
    console.log(response.successCount + ' messages were sent successfully')
  })

}