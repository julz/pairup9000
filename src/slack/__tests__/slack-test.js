const Promise = require('es6-promise')
const fetchMock = require('fetch-mock/es5/server')

import { updateGroup } from '..'

describe("updateGroup", function() {
    beforeEach(function() {
      fetchMock.mock('https://slack.com/api/users.list?token=', {
          ok: true,
          members: [
            {name: 'zyu', id: 'z'},
            {name: 'gsabev', id: 'g'}
          ]
      }).mock('https://slack.com/api/usergroups.users.update', 'POST', {
          ok: true,
          usergroup: { id: 'some-id' }
      })
    })

    afterEach(function() {
      fetchMock.restore()
    })


    describe("when the 'gardenci' slack group exists", function() {
      beforeEach(function() {
        fetchMock.mock('https://slack.com/api/usergroups.list?token=', {
          ok: true,
          usergroups: [{
            handle: 'gardenci',
            id: 'some-id'
          }],
        })
      })

      it("updates the 'gardenci' slack usergroup", function(done) {
        updateGroup('gardenci', ['zyu', 'gsabev'], (groupId) => {
          expect(fetchMock.called('https://slack.com/api/usergroups.list?token=')).toBe(true)
          expect(fetchMock.called('https://slack.com/api/users.list?token=')).toBe(true)
          expect(fetchMock.called('https://slack.com/api/usergroups.create')).toBe(false)
          expect(fetchMock.called('https://slack.com/api/usergroups.users.update')).toBe(true)
          expect(groupId).toEqual('some-id')
          done()
        })
      })
    })

    describe("when the 'gardenci' slack group does not existxs", function() {
      beforeEach(function() {
        fetchMock.mock('https://slack.com/api/usergroups.list?token=', {
          ok: true,
          usergroups: []
        }).mock('https://slack.com/api/usergroups.create', 'POST', {
          ok: true,
          usergroup: {id: 'some-id'}
        })
      })

      it("creates & updates the 'gardenci' slack usergroup", function(done) {
        updateGroup('gardenci', ['zyu', 'gsabev'], (groupId) => {
          expect(fetchMock.called('https://slack.com/api/usergroups.list?token=')).toBe(true)
          expect(fetchMock.called('https://slack.com/api/users.list?token=')).toBe(true)
          expect(fetchMock.called('https://slack.com/api/usergroups.create')).toBe(true)
          expect(fetchMock.called('https://slack.com/api/usergroups.users.update')).toBe(true)
          expect(groupId).toEqual('some-id')
          done()
        })
      })
    })
})

