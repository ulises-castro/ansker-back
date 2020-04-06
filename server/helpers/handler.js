const handler = promise => (
  promise.
    then(data => ({ data, err: null }))
    .catch(err => ({ err, data: null }))
)

export { handler }