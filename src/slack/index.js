const slackApiToken = process.env.SLACK_API_TOKEN || '';

function getUsergroupId(handle, process) {
  fetch('https://slack.com/api/usergroups.list?token=' + slackApiToken).then(resp => {
    return resp.json()
  }).then(json => {
    if (!json.ok) {
      console.log('usergroups.list', json.error)
      return
    }

    const filteredUsergroups = json.usergroups.filter(group => {
      return group.handle == handle
    })
    if (filteredUsergroups.length > 0) {
      process(filteredUsergroups[0].id)
      return
    }

    // if gardenci group does not exist
    // attempt to create this group
    const formData = new FormData()
    formData.append('token', slackApiToken)
    formData.append('name', 'The Garden Team CI Pair')
    formData.append('handle', 'gardenci')
    fetch('https://slack.com/api/usergroups.create', {
      method: 'POST',
      body: formData
    }).then(resp => {
      return resp.json()
    }).then(json => {
      if (!json.ok) {
        console.log('usergroups.create', json.error)
        return
      }
      process(json.usergroup.id)
    })
  })
}

function getUserIds(slackHandles, process) {
  fetch('https://slack.com/api/users.list?token=' + slackApiToken).then(resp => {
    return resp.json()
  }).then(json => {
    if (!json.ok) {
      console.log('users.list', json.error)
      return
    }

    const pairUids = json.members.filter(member => {
      return slackHandles.indexOf(member.name) >= 0
    }).map(member => {
      return member.id
    })
    process(pairUids)
  })
}

function updateUsergroup(id, uIds, onSuccess) {
  const formData = new FormData()
  formData.append('token', slackApiToken)
  formData.append('usergroups', id)
  formData.append('users', uIds.join(','))

  fetch('https://slack.com/api/usergroups.users.update', {
    method: 'POST',
    body: formData
  }).then(resp => {
    return resp.json()
  }).then(json => {
    if (!json.ok) {
      console.log('usergroups.users.update', json.error)
      return
    }

    onSuccess(json.usergroup.id)
  })
}

export function updateGroup(groupHandle, slackHandles, onSuccess=()=>{}) {
  getUsergroupId(groupHandle, (id) => {
    getUserIds(slackHandles, uIds => {
      updateUsergroup(id, uIds, onSuccess)
    })
  })
}
